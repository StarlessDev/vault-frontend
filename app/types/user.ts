interface User {
  id: number;
  username: string;
  uploads?: UserUpload[];
}

interface UserUpload {
  fileId: string,
  uploaderId: number,
  fileName: string,
  uploadDate: number,
  totalDownloads: number,
  lastDownload: number  
}

