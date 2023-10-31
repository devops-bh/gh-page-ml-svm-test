//const Inferrer = require("inferrer")

/* 
https://coderwall.com/p/iyhizq/get-the-pixel-data-of-an-image-in-html
function getPixel(url, x, y) {
  var img = new Image();
  img.src = url;
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.drawImage(img, 0, 0);
  return context.getImageData(x, y, 1, 1).data;
}
getPixel('./bg.png', 50, 50); // [255, 255, 255, 0];
*/
/* 
so are Image & HTMLImage interchangeable? 
I.e. if I already have an HTMLImage, then it can be assumed I already have an Image()? 
const image = new Image();
image.src = "plumeria.jpg";
*/
function getPixelData(imgElement) {
//	const image = new Image();
//	image.src = "cat.jpg";
//image.addEventListener("load", () => {
	// todo: make sure these arguments match up
		//imgElement.setAttribute('crossOrigin', '');
		const canvas = document.getElementById('image-pixel-data');
		const ctx = canvas.getContext('2d');
		ctx.drawImage(imgElement, 
					// with orign at top left cornern, place image at X, Y coordinates 
					0, 0, 
					// destination width, dheight (not entirely sure what these mean)
					50, 50);
		// source = original image 
		// s = source 					sx  sy	sw  sh	
	 /* const imageData = ctx.getImageData(0, 0, 50, 50);
	// here we actually paint the image onto the canvas, so don't think I need this part 
	  ctx.putImageData(imageData, 0, 0);
	  */
	// I don't care about displaying the image, so I think I only need to return the gotten image data? 
	return imageData // fed into nj.array e.g. nj.array(getPixel(dogImage))
//})
}

console.log("Running...")
// window.setTimeout was a quick hack to ensure OpenCV had loaded, though I assumed it'd load synchronously 
// https://stackoverflow.com/a/63211547
window.setTimeout(() => {
		console.log("Running: ")
		function get_pixel_data_OpenCV(imgElement) {
			let matrix = cv.imread(imgElement); // calls context.getImageData :| 
			console.log(matrix)
			return matrix
		} 
		
		let training_data = []
		const appendToTrainingData = (imageElements) => {
			Array.from(imageElements).map(imageElement => {
					console.log("mapping")
					/* np = nj = numjs library (so far it looks like the same API as Numpy)
					am I able to do 
					const pet_img = nj.array(dogImage.src) 
					*/
					// do I need opencv? or is having access to the img src enough? 
					// or do I need to use OpenCV to open/load the image 
					/* 
					not sure if I need OpenCV yet, I believe I can using HTML/JS to get the actual pixel data 
					But I need to load the images onto a (hidden) canvas 
					then I believe getImageData is a method of the context object 
					*/
					// https://stackoverflow.com/questions/22097747/how-to-fix-
					// I can't ignore the error mentioned in that SO post because I need getImageData to be called 
					// so I think (so long as I do not have access to the server hosting my website) 
					// I need to use local images 
					// this is another reason that a server (one I can actually manipulate as opposed to Github Pages etc) may be inevitable ; will know more when I look into the HTML5 file upload API e.g. where do the images live? Are they on the same origin as the ML script? 
					//const pet_image = getPixelData(imageElement) 
					const pet_image = get_pixel_data_OpenCV(imageElement) 
					console.log(pet_image)
					// now I can push the pixels as a numpy array along with their labels to the training_data 
					// I'm not quite a fan of storing the pixel array and the label as a sub array, 
					// I'd rather use a key-value pair, but I believe the example I am basing the code does 
					// it this way 
					training_data.push([nj.array(pet_image), imageElement.dataset.label])	
					
					// then i'd do something like 
					/* 
					const img = cv.imread(dogImage.src)
					// resize (the HTML image elements are 50X50) 
					// const resized = cv.resize(img, [50, 50])
					training_data.push(np.array(pet_img), dogImage.dataset.label)	
					*/
					//training_data.push(dogImage, dogImage.dataset.label)
			})
		} 
		
		function shuffle(array) {
			let currentIndex = array.length,  randomIndex;
			
			// While there remain elements to shuffle.
			while (currentIndex > 0) {
				
				// Pick a remaining element.
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex--;
				
				// And swap it with the current element.
				[array[currentIndex], array[randomIndex]] = [
					array[randomIndex], array[currentIndex]];
				}
				
				return array;
			}
			
			
			const dogImages = document.querySelectorAll('img[data-label="dog"]');
			const catImages = document.querySelectorAll('img[data-label="cat"]');
			console.log("updated")
			appendToTrainingData(dogImages)
			appendToTrainingData(catImages) 
			const training_data_shuffled = shuffle(training_data)
			
			/* 
			now the data should be prepared to pass into a machine learning model 
			e.g. SVM, RF, or conv net 
			But remember training_data is not a flattened array 
			& I'm not sure how the flattening would work if the pixel data is mixed with the labels :|
			*/
			
			
			/* 
			original Python code from: 
			D:\software-dev-2\machine-learning\classical-models\train-svm.py
			for feature, label in data:
			features.append(feature)
	labels.append(label)
	^ so I guess feature, label is kind of like destructuring, hence I could merely use a dictionary (an object literal or a Map)
	
	my data looks like: [Array(2), ...] 
	so I could have a loop which for the odd numbers e.g. n % 1 == 0 is the actual pixel data 
	& n % 2 == 0 is the actual label? 
	*/	
	
	let features = []
	let labels = []
	training_data_shuffled.forEach((element, index) => {
		features.push(element[0])
		if (element[1].toLowerCase() == "dog") {	
			labels.push(0)
		}
		if (element[1].toLowerCase() == "cat") {	
			labels.push(1)
		}
		
		/* 
		if (index % 1 == 0) {
			features.push(element)
		} 
		if (index % 2 == 0) {
			if (element == "dog") {
				labels.push(0)
			}
			if (element == "cat") {
				labels.push(1)
			}
		}	
		*/ 
	})
	
	/* 
	ok, the data is ready to be passed to the machine learning model 
	it would be nice if I was able to save this data & then load it into the Python SVM 
	and the Python conv net (e.g. Sentdex's model) 
	But A. I can't be bothered B. at the moment there's such little data it'd be hard to know if its actually working 
	*/ 
	
	/* note: I sense that we are entering into hardware accelerated computing e.g. WebGL or WebAssembly etc, I originally assumed that there would be an SVM module in pure ES5 JavaScript, but it'd seem that if I was/am really concerned with the SVM working on say a legacy browser within a budget smartphone... then I may need to code the SVM myself in pure ES5 (or lower, then its like "ohh well, just write it in Flash :P") , I am yet to confirm 
	if a TensorflowJS convolutional neural network is pure JavaScript or if there's some performance trickery going on where its assumed legacy browsers are not being used 
	*/ 
	
	/*
	const XOR = new Inferrer({ kernel: "gaussian", gamma: 2 })
	
	// I made the preprocessing code before looking at this library :| 
	// so, why is "-1"? is this representing a class? e.g. dog = 1, cat = -1? can I use 0 instead? 
	// also I'm not entirely sure if I am understanding XOR , is it just another name for binary classifier
	// or is it a binary classifer for a more specific purpose e.g. "the XOR problem?" (which I assumed was another name 
	// for binary classification)
	// element = [feature, label] 
	XOR_training_data = training_data_shuffled.map((element, index) => {
		// just a quick hack to make sure the Inferrence library is working (will obviously need to use more robost code)
		if (index < 1) { console.log("Validation sample: ", element[1]) }
		if (index >= 1) {
			let feature = element[0]
			let label = null // dog = 1, cat = -1 
			if (element[1].toLowerCase() == "dog") {	
				label = 1
			}
			if (element[1].toLowerCase() == "cat") {	
				label = -1 
			}
			return {input: feature, classification: label}
		}
	})
	
	XOR.train(XOR_training_data)
	
	const prediction = XOR.classify(XOR_training_data[0])
	console.log("prediction: ", prediction)
	*/ 

	}, 300)
