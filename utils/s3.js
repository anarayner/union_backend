const AWS = require('aws-sdk');
const fs = require("fs");
require('dotenv').config();

const s3 = new AWS.S3({
    region: 'us-east-2',
    accessKeyId: 'AKIA34HNW7ZB6SNZCUPJ',
    secretAccessKey: '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'
});

function uploadImg(file, name){
    console.log(process.env.S3_BUCKET)
    const params = {
        Bucket: 'union-backet',
        Key: name,
        Body: file.data
    };

    return s3.upload (params).promise ()
}
exports.uploadImg = uploadImg

function getImg(fileKey){
    const params = {
        Bucket: 'union-backet',
        Key: fileKey,
    };

    return s3.getObject(params).createReadStream()
}
exports.getImg = getImg
