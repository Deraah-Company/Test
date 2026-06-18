const DEFAULT_FOLDER_ID = '1LhrsX9LdYeJVifivL5xSkNYGyK2ov4VT';

function doGet() {
  return json({ success: true, service: 'Deraah Drive uploader', actions: ['uploadVideo'] });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (body.action === 'uploadVideo') return json(uploadVideo(body));
    return json({ success: false, error: 'Unknown action: ' + body.action });
  } catch (err) {
    return json({ success: false, error: err.message });
  }
}

function uploadVideo(body) {
  if (!body.fileData) throw new Error('Missing fileData');
  const folderId = body.folderId || DEFAULT_FOLDER_ID;
  const folder = DriveApp.getFolderById(folderId);
  const bytes = Utilities.base64Decode(body.fileData);
  const blob = Utilities.newBlob(bytes, body.mimeType || 'video/mp4', body.fileName || 'video.mp4');
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return {
    success: true,
    fileId: file.getId(),
    url: 'https://drive.google.com/file/d/' + file.getId() + '/view'
  };
}

function json(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
