import { Md5 } from 'ts-md5';

export class Encryption{
    
    computeMD5Hash(password: string): string{
        return Md5.hashStr(password);
    }
}