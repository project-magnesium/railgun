import { CloudFrontRequestEvent, Context, CloudFrontRequestCallback } from 'aws-lambda';

exports.handler = (event: CloudFrontRequestEvent, context: Context, callback: CloudFrontRequestCallback) => {
    const request = event.Records[0].cf.request;
    const olduri = request.uri;
    const newuri = olduri.replace(/app\/?$/, 'app/index.html');
    request.uri = newuri;

    return callback(null, request);
};
