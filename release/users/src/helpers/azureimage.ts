const fs = require('fs');
const { BlobServiceClient } = require('@azure/storage-blob');
const logger = require('./logger');
import AppConstants from '../utils/constant';

const appConstant = new AppConstants();

export default class AzureImage {

    /**
     * Save image in azure storage
     */
    async saveImage(files: Record<string, any>, blobName: any) {
        try {
            const fileData = fs.createReadStream(files.filepath);
            const containerName = process.env.CONTAINER_NAME;
            const sasToken = process.env.SAS_TOKEN;
            const blobServiceClient = new BlobServiceClient(
                `https://${containerName}.blob.core.windows.net/images/${blobName}?${sasToken}`
            );
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.uploadStream(fileData, files.size, 4, {
                blobHTTPHeaders: {
                    blobContentType: files.mimetype
                }
            });
            // Get the URL of the uploaded image
            const blobUrl = blockBlobClient.url;
            logger.error(appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD_COMPLETED);
            return blobUrl;
        } catch (error: any) {
            logger.error(appConstant.LOGGER_MESSAGE.UPDATED_USER_AND_IMAGE_UPLOAD_FAILED + error);
            throw new Error(error.message);
        }
    }

    /**
     * Delete image in azure storage
     */
    async deleteImage(userData: any) {
        try {
            const containerName = process.env.CONTAINER_NAME;
            const sasToken = process.env.SAS_TOKEN;
            const blobName = userData.blob_Name;
            const blobServiceClient = new BlobServiceClient(`https://${containerName}.blob.core.windows.net/images/${blobName}?${sasToken}`);
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlobClient(blobName);

            const exists = await blobClient.exists();
            if (!exists) {
                logger.error(appConstant.LOGGER_MESSAGE.BLOB_NOT_EXIST);
                return; // Or throw an error if needed
            }
            await blobClient.delete();
            logger.info(appConstant.LOGGER_MESSAGE.BLOB_DELETED)
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

}