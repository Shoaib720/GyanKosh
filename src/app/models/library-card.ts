import { BookRecord } from "./book-record";

export class LibraryCard{
    cardId: String | undefined;
    cardHolderId: String | undefined;
    cardHolderName: String | undefined;
    bookRecord: BookRecord | undefined;
}