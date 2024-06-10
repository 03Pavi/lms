const { Storage } = require('@google-cloud/storage');
const { allowed_file_types, storage_base_url, max_file_size } = require('../lib/constants');
const { get_nanoid, get_gcp_content_type } = require('../lib/utils');
const { GCP_BUCKET_NAME, GCP_CREDENTIALS_PATH } = process.env;

const storage = new Storage({ keyFilename: GCP_CREDENTIALS_PATH });
const path = require('path');

exports.generate_v4_upload_signed_url = async (payload) => {
    let { name , size, file_name } = payload;

    if (!name || name.trim() === '') throw Object.assign(new Error(), {name:'BAD_REQUEST', message:'File name not specified'});
    if (!size || size.trim() === '') throw Object.assign(new Error(), {name:'BAD_REQUEST', message:'File size not specified'});

    if (Number(size) > max_file_size) throw Object.assign(new Error(), {name:'BAD_REQUEST', message:'Size should be of 3 MB'});

    const ext = path.extname(name)?.replace(/\./g, '');
    if (allowed_file_types.indexOf(ext.toLowerCase()) == -1) throw Object.assign(new Error(), {name:'BAD_REQUEST', message:'Content-Type not allowed'});
    
    const gcp_content_type = get_gcp_content_type({ file_extension: ext });
    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: gcp_content_type,
        extensionHeaders: { "x-goog-content-length-range": `0,${Math.min(size, max_file_size)}` },
    };
    
    // Get a v4 signed URL for uploading file
    const [url] = await storage
        .bucket(GCP_BUCKET_NAME)
        .file(file_name,
            {
                destination: 'attendance_justification/' + file_name,
            }
        )
        .getSignedUrl(options);

    console.log('Generated PUT signed URL:');
    console.log(url);

    return { upload_url: url, content_type: gcp_content_type, file_url: `${storage_base_url}/${GCP_BUCKET_NAME}/${file_name}` };

};

exports.set_cors = async (payload) => {
    const data = payload;
    console.log('Setting cors');
    const cors = data?.cors ?? [
        {
            method: ["PUT", "GET"],
            origin: ["*"],
            "allowedHeaders": ["*"],
            "responseHeader": [
                "Content-Type",
                "x-goog-content-length-range"
            ],
        }];
    await storage.bucket(GCP_BUCKET_NAME).setCorsConfiguration(cors);
    return ({ msg: "cors successfully set" });
};

exports.get_read_signed_url = async (payload = {}) => {
    let { name } = payload;
    if (!name || name.trim() === '') throw Object.assign(new Error(), {name:'BAD_REQUEST', message:'File name not specified'});
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
    // Get a v4 signed URL for reading file
    const [url] = await storage.bucket(GCP_BUCKET_NAME).file(name, { destination: 'attendance_justification/' + name }).getSignedUrl(options);
    console.log('Generated read signed URL:');
    console.log(url);
    return { read_url: url, file_name: name };
};

exports.delete_file_from_bucket = async (payload) => {
    let { name } = payload;
    if (!name || name.trim() === '') throw Object.assign(new Error(), { name: 'BAD_REQUEST', message: 'File name not specified' });

    await storage.bucket(GCP_BUCKET_NAME).file(name).delete();
    console.log(`Deleted file: ${name}`);
    return { message: 'File deleted successfully' };
};