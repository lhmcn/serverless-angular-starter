import { v4 as uuid } from "uuid";
import { getFileExt } from "../Util";
import * as Storage from "@aws-amplify/storage";
import { Observable, Subject } from "rxjs";

/**
 * Uploads a file to public/tmp directory
 * @param file The file object.
 * @return Returns the storage key of the file.
 */
export const s3Upload = (file: File): Observable<string> => {
	const resultSubject = new Subject<string>();

	const fileKey = `${uuid()}.${getFileExt(file.name)}`;

	Storage.uploadData({
		path: "tmp/" + fileKey,
		data: file,
		options: {
			contentType: file.type,
		},
	})
		.result.then(() => {
			resultSubject.next(fileKey);
		})
		.catch((err) => {
			console.log(err);

			resultSubject.next("");
		});

	return resultSubject.asObservable();
};

/**
 * Gets the access url of a file in the S3 bucket
 * @param key The storage key of the file
 * @param removeSignature By default, the url comes with the signature. If you are accessing a public bucket,
 * you can choose to remove the signature so that the url can be used forever.
 * @return Returns the url
 */
export const s3Get = (
	key: string,
	removeSignature: boolean = false,
): Observable<string> => {
	const resultSubject = new Subject<string>();

	Storage.getUrl({ path: key })
		.then((output) => {
			const url = output.url;
			if (removeSignature) {
				resultSubject.next(
					`${url.protocol}://${url.host}${url.pathname}`,
				);
			} else {
				resultSubject.next(url.href);
			}
		})
		.catch((err) => {
			console.log(err);

			resultSubject.next("");
		});

	return resultSubject.asObservable();
};

/**
 * Removes a file in the S3 bucket
 * @param key The storage key of the file
 */
export const s3Remove = (
	key: string,
): Observable<Storage.RemoveWithPathOutput> => {
	const resultSubject = new Subject<Storage.RemoveWithPathOutput>();

	Storage.remove({ path: key })
		.then((result) => {
			resultSubject.next(result);
		})
		.catch((err: any) => {
			console.log(err);

			resultSubject.next({ path: "" });
		});

	return resultSubject.asObservable();
};
