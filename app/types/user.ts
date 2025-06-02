interface User {
  id: number;
  username: string;
  email: string;
  uploads?: UserUpload[];
}

interface UserUpload {
  fileId: string,
  uploaderId: number,
  fileName: string,
  size: number,
  uploadDate: number,
  totalDownloads: number,
  lastDownload: number  
}

