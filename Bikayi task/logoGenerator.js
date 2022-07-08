const backgroundColor = "transparent";
const simpleBackground = false;
const shadowOpacity = 0.6;
const xShadowOffset = 4;
const yShadowOffset = 3;
const logoContainer = document.getElementById("logo-container");

function hexToRGB(hex, alpha) {
	const r = parseInt(hex.slice(1, 3), 16),
		g = parseInt(hex.slice(3, 5), 16),
		b = parseInt(hex.slice(5, 7), 16);

	return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
}

const drawComplexBackground = (ctx, size) => {
	const rightColor = document.getElementById("colorTwo").value;
	const leftColor = document.getElementById("colorOne").value;
	const rightColorRGBA = hexToRGB(rightColor, shadowOpacity);
	const leftColorRGBA = hexToRGB(leftColor, shadowOpacity);

	const gradient = ctx.createLinearGradient(0, 0, size, size);
	gradient.addColorStop(0, rightColorRGBA);
	gradient.addColorStop(1, leftColorRGBA);
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, size, size);
};

const showVerticalCenter = (ctx, size) => {
	ctx.strokeStyle = "red";
	ctx.moveTo(5, size / 2);
	ctx.lineTo(size - 5, size / 2);
	ctx.stroke();
};

const createLogoElement = async (fontName, fontPath, yOffset = 0) => {
	const font = await createFont(fontName, fontPath);
	const size = document.getElementById("previewSize").value;
	const logo = await createLogoCanvas({ fontName, size, yOffset });

	const logoDiv = document.createElement("div");
	logoDiv.className = "logoDiv";

	const download = document.createElement("button");
	download.innerHTML = `<span>Download '${fontName}'</span>`;
	download.onclick = () => downloadLogo(fontName, yOffset);

	logoDiv.appendChild(logo);
	logoDiv.appendChild(download);

	logoContainer.appendChild(logoDiv);
};

const createFont = async (fontName, fontPath) => {
	const logoFont = new FontFace(fontName, `url(${fontPath})`);
	await logoFont.load();

	document.fonts.add(logoFont);
	return logoFont;
};

const createLogoCanvas = async ({
	fontName,
	size,
	yOffset,
	hidden,
	letterSize,
	text,
	letterColor,
	leftColor,
	rightColor,
}) => {
	if (!size) size = document.getElementById("previewSize").value || 256;
	if (!letterSize) letterSize = document.getElementById("fontSize").value || 20;
	if (!text) text = document.getElementById("logoText").value || "Testing";
	if (!letterColor) letterColor = document.getElementById("letterColor").value;
	if (!leftColor) leftColor = document.getElementById("colorOne").value;
	if (!rightColor) rightColor = document.getElementById("colorTwo").value;

	// Convert the right and left hex colors to RGBA
	const rightColorRGBA = hexToRGB(rightColor, shadowOpacity);
	const leftColorRGBA = hexToRGB(leftColor, shadowOpacity);

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	canvas.className = hidden ? "hiddenCanvas" : "visibleCanvas";
	canvas.id = fontName;
	canvas.dataset.yOffset = yOffset;

	const yOffsetPixels = (yOffset * size) / 100;

	canvas.width = size;
	canvas.height = size;

	// Draw the background
	if (simpleBackground) {
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, size, size);
	} else {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, size, size);
		drawComplexBackground(ctx, size);
	}

	ctx.textBaseline = "middle";
	const xPos = canvas.width / 2;
	const yPos = canvas.height / 2 + yOffsetPixels;

	// Draw the text in the specified color and font
	const fontSize = (letterSize / 100) * size;
	ctx.font = `${fontSize}px ${fontName}`;
	ctx.fillStyle = letterColor;
	ctx.textAlign = "center";
	ctx.fillText(text, xPos, yPos);

	ctx.shadowBlur = 4;

	// Draw southeast shadow
	ctx.shadowOffsetX = xShadowOffset;
	ctx.shadowOffsetY = yShadowOffset;
	ctx.shadowColor = rightColorRGBA;
	ctx.fillText(text, xPos, yPos);

	// Draw northwest shadow
	ctx.shadowOffsetX = -xShadowOffset;
	ctx.shadowOffsetY = -yShadowOffset;
	ctx.shadowColor = leftColorRGBA;
	ctx.fillText(text, xPos, yPos);

	return canvas;
};

const downloadLogo = async (fontName, yOffset) => {
	const downloadSize = document.getElementById("downloadSize").value;
	const fullSizeLogo = await createLogoCanvas({
		fontName,
		size: downloadSize,
		yOffset,
		hidden: true,
	});

	const text = document.getElementById("logoText").value || "Testing";
	const link = document.createElement("a");
	link.download = `${fontName}_${text}_logo.png`;
	link.href = fullSizeLogo.toDataURL("image/png");
	link.click();
};

const fontsToRender = [
	["Adoria", "./fonts/Adoria.ttf", 10],
	["Avalon", "./fonts/Avalon.woff2"],
	["Beach Boy", "./fonts/BeachBoy.otf"],
	["Bios Bold", "./fonts/Bios-Bold.otf"],
	["Bios Regular", "./fonts/Bios-Regular.otf"],

	["Broken Console Bold", "./fonts/Broken-Console-Bold.ttf", 15],
	["Broken Console", "./fonts/Broken-Console.ttf", 15],
	["Claudilla", "./fonts/Claudilla.ttf", 5],
	["Dirtchunk", "./fonts/Dirtchunk.otf", 7.5],
	["Enigmatica", "./fonts/Enigmatica.otf", 10],

	["Flare", "./fonts/Flare.ttf", 10],
	["Gluon", "./fonts/Gluon.ttf", -15],
	["Hermes", "./fonts/Hermes.otf", -15],
	["Hotliner Second", "./fonts/Hotliner-Second.otf"],
];

fontsToRender.forEach((params) => createLogoElement(...params));
