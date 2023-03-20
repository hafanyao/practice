/**
 * @description 计算文件大小
 * @param {number} fileSize 文件大小
 * @return {string} 计算后的文件大小值
 **/
export const name = (fileSize = 0) => {
	if (!fileSize) return null;
	let size = 0,
		unit = "";
	if (fileSize > 1073741824) {
		size = (fileSize / 1073741824).toFixed(4) * 1;
		unit = "GB";
	} else if (fileSize > 1048576) {
		size = (fileSize / 1048576).toFixed(4) * 1;
		unit = "MB";
	} else if (fileSize > 1024) {
		size = (fileSize / 1024).toFixed(4) * 1;
		unit = "KB";
	} else {
		size = fileSize;
		unit = "B";
	}
	return size + unit;
};

/**
 * @description 获取音/视频时长
 * @param {string/object} file 文件地址/对象
 * @return {number} 媒体文件时长
 **/
export const getMediaDuration = file => {
	return new Promise(resolve => {
		// 是否是文件对象
		let hasFile = file instanceof File;
		let fileUrl = hasFile ? URL.createObjectURL(file) : file;
		// 创建对象
		let audioElement = new Audio(fileUrl);
		// 监听对象
		audioElement.addEventListener("loadedmetadata", () => {
			let time = Math.floor(audioElement.duration) || 0;
			resolve(time);
		});
		// 加载失败
		audioElement.addEventListener("error", () => {
			resolve(0);
		});
	});
};

/**
 * @description 下载文件
 * @param {string} fileUrl 文件链接地址
 **/
export const downloadFile = fileUrl => {
	const iframe = document.createElement("iframe");
	// 防止影响页面布局
	iframe.style.display = "none";
	iframe.style.height = 0;
	iframe.src = fileUrl;
	document.body.appendChild(iframe);
	// 加载完成后移除创建的标签
	iframe.onload = function () {
		document.body.removeChild(iframe);
	};
};