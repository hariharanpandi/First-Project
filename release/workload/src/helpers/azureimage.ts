const fs = require('fs');
const { BlobServiceClient } = require('@azure/storage-blob');
const logger = require('./logger');
import AppConstants from '../utils/constant';

const appConstant = new AppConstants();

export default class AzureImage {

    /**
     * Save image in azure storage
     */
    async saveImage(imgFile: Record<string, any>, blobName: any) {
        try {

            const fileData = fs.createReadStream(imgFile.File.filepath);
            const containerName = process.env.CONTAINER_NAME;
            const sasToken = process.env.SAS_TOKEN;
            // const blobName = Date.now().toString() + '-' + imgFile.File.originalFilename;
            const blobServiceClient = new BlobServiceClient(
                `https://${containerName}.blob.core.windows.net/images/${blobName}?${sasToken}`
            );
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.uploadStream(fileData, imgFile.File.size, 4, {
                blobHTTPHeaders: {
                    blobContentType: imgFile.File.mimetype
                }
            });
            const blobUrl = blockBlobClient.url;
            logger.info(appConstant.LOGGER_MESSAGE.SAVE_IMG);
            return blobUrl;
        } catch (error: any) {
            logger.error(`${appConstant.LOGGER_MESSAGE.IMG_FAILED} ${error.message}`);
            throw new Error(error.message);
        }
    }

    /**
     * Delete image in azure storage
     */
    async deleteImage(appData: any) {
        try {
            const containerName = process.env.CONTAINER_NAME;
            const sasToken = process.env.SAS_TOKEN;
            const blobName = appData.blob_Name;
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