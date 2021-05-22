import { LibraryCard } from "./library-card";

export class Customer{

    id: string | undefined;
    email: string | undefined;
    name: string | undefined;
    password: string | undefined;
    libraryCard: LibraryCard | undefined;
}