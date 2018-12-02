import { Helpers } from "../helpers";
import { userDB } from "../dummyDB";
import { userInfo } from "os";

let inputs;

export class PostValidator {
	/**
   * Validate values inside an array
   * @param  { object } req - Contains the body of the request.
   * @param { object } res - Contains the returned response.
   * @param  { next } - Proceeds to the next method on the route
   */
	static validateArrayValues(req, res, next) {
		const { images, videos } = req.body;
		const urlArray = [images, videos];

		if (Helpers.isNotArray(urlArray)) {
			Helpers.returnForError(req, res, 400, "invalid input");

		} else if (Helpers.isStringInsideArray(images)) {
			Helpers.returnForError(req, res, 400, "invalid input");

		} else if (Helpers.isStringInsideArray(videos)) {
			Helpers.returnForError(req, res, 400, "invalid input");

		} else if (Helpers.isValueInsideArrayEmpty(images)) {
			Helpers.returnForError(req, res, 400, "undefined input");

		} else if (Helpers.isValueInsideArrayEmpty(videos)) {
			Helpers.returnForError(req, res, 400, "undefined input");

		} else {
			next();
		}
	}

	/**
   * Validates users location input field for a single string field
   * @param  { object } req - Contains the body of the request.
   * @param { object } res - Contains the returned response.
   * @param  { next } - Proceeds to the next method on the route
   */
	static locationStringValidation  (req, res, next)  {
		const { location } = req.body;

		Helpers.thoroughStringCheck(req, res, location, next);
	}

	/**
   * Validates the comment input field for a single string field
   * @param  { object } req - Contains the body of the request.
   * @param { object } res - Contains the returned response.
   * @param  { next } - Proceeds to the next method on the route
   */
	static commentStringValidation(req, res, next) {
		const { comment } = req.body;

		Helpers.thoroughStringCheck(req, res, comment, next);
	}

	/**
 * Validates the profile image input field
 * @param  { object } req - Contains the body of the request.
 * @param { object } res - Contains the returned response.
 * @param  { next } - Proceeds to the next method on the route
 */
	static profileImageStringValidation(req, res, next) {
		const { profileImage } = req.body;

		if (Helpers.nowhiteSpace(profileImage)) {
			Helpers.returnForError(req, res, 400, "white space detected");
		} else {
			Helpers.thoroughStringCheck(req, res, profileImage, next);
		}
	}


	/**
   * Validates users input for report creation
   * @param  { object } req - Contains the body of the request.
   * @param { object } res - Contains the returned response.
   * @param  { next } - Proceeds to the next method on the route
   */
	static multipleStringValidation(req, res, next) {
		const { title, comment, type, location, images, videos } = req.body;
		const strings = [title, comment, type, location];
		const reqArray = [title, comment, type, location, images, videos];

		for (inputs in reqArray) {
			if (!reqArray[inputs]) {
				return Helpers.returnForError(req, res, 400, "undefined input");
			}
		}
		for (inputs in strings) {
			if (!(/[^\s+]/g.test(reqArray[inputs]))) {
				return Helpers.returnForError(req, res, 400, "undefined input");
			}
		}
		for (inputs in strings) {
			if (Helpers.isNotString(strings[inputs])) {
				return Helpers.returnForError(req, res, 400, "invalid input");
			}
		}
		next();
	}


	/**
   * Checks if input is a red-flag type
   * @param  { object } req - Contains the body of the request.
   * @param { object } res - Contains the returned response.
   * @param  { next } - Proceeds to the next method on the route
   */
	static isRedFlag(req, res, next) {
		const { type } = req.body;
		if (type.toLowerCase() !== "red-flag") {
			Helpers.returnForError(req, res, 400, "invalid input");
		} else {
			next();
		}
	}


	/**
   * Validate status input by admin
   * @param  { object } req - Contains the body of the request.
   * @param { object } res - Contains the returned response.
   * @param  { next } - Proceeds to the next method on the route
   */
	static validateStatus(req, res, next) {
		const { status } = req.body;
		const validValues = ["draft", "under investigation", "resolved", "rejected"];
		let inputs;

		if (!status) {
			return Helpers.returnForError(req, res, 400, "undefined input");
		} else if (typeof status !== "string") {
			return Helpers.returnForError(req, res, 400, "invalid input");
		}

		for (inputs = 0; inputs < validValues.length; inputs++) {
			if (status.toString().toLowerCase() === validValues[inputs] ){
				return next();
			}
		}
		Helpers.returnForError(req, res, 400, "invalid input");
	}


	/**
   * Validates if users exist in the database
   * @param  { object } req - Contains the body of the request.
   * @param { object } res - Contains the returned response.
   * @param  { next } - Proceeds to the next method on the route
   */
	static isUser(req, res, next) {
		const { createdBy } = req.body;
		const userId = userDB.filter((user) => user.id === createdBy);

		if (typeof createdBy !== "number") {
			Helpers.returnForError(req, res, 400, "invalid input");
		} else if (userId.length < 1) {
			Helpers.returnForError(req, res, 404, "user not found");
		} else {
			next();
		}
	}

}

