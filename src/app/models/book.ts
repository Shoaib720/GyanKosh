export class Book{
    id: string | undefined;
    title: string | undefined;
    authors: string[] | undefined;
    category: string | undefined;
    rackNumber: number | undefined;
    issuedBy: string | undefined;
    checkedOutBy: string | undefined;
    coverImageUrl: string | undefined;
    publicationDate: Date | undefined;
    isDue: boolean | undefined;
}