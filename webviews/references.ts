export class Ref {
    private static numRefs: number = 0;
    private static allRefs: Array<Ref> = [];
    private id: number;
    private sourceName: string;
    private sourceLink: string;
    private infoToDisplay: string[];
    private keywords: string[];
    private open: boolean = false;
    private saved: boolean = false;
    private new: boolean = true;
    private example?: string;
    private identifiedFromSpeech: boolean = false;
    private timeLastHeard: Date = new Date(); // sets date when initialized, but won't be used

    public constructor (sourceName: string, sourceLink: string, infoToDisplay: string[], keywords: string[], example?: string) {
        this.id = Ref.numRefs++;
        this.sourceName = sourceName;
        this.sourceLink = sourceLink;
        this.infoToDisplay = infoToDisplay;
        this.keywords = keywords;
        this.example = example;
        Ref.allRefs.push(this);
    }

    public getId() {
        return this.id;
    }

    public getSourceName() {
        return this.sourceName;
    }

    public getSourceLink() {
        return this.sourceLink;
    }

    public getInfoToDisplay() {
        return this.infoToDisplay;
    }

    public getKeywords() {
        return this.keywords;
    }

    public getExamples() {
        return this.example;
    }

    public getTimeLastHeard() {
        return this.timeLastHeard;
    }

    public isOpen() {
        return this.open;
    }

    public isSaved() {
        return this.saved;
    }

    public isNew() {
        return this.new;
    }

    public isIdentifiedBySpeech() {
        return this.identifiedFromSpeech;
    }

    public setOrUpdateIdentifiedBySpeech() {
        if (!this.identifiedFromSpeech) {
            this.identifiedFromSpeech = true;
        } 
        this.timeLastHeard = new Date(); // reset time
    }

    public clearIdentifiedBySpeech() {
        this.identifiedFromSpeech = false;
    }

    public toggleOpenOrClose(openStatus?: boolean) {
        if (openStatus) { // specify open or closed
            this.open = openStatus;
        } else { // toggle
            this.open = !this.open;
        }
    }

    public toggleSaveStatus(save?: boolean) {
        if (save) { // specify saved or not
            this.saved = true;
        } else { // toggle
            this.saved = !this.saved;
        }   
    }

    public setNotNew() {
        this.new = false;
    }

    public static getRefById(id: number): Ref {
        return Ref.allRefs[id];
    }

    public static getAllRefs(): Ref[] {
        return Ref.allRefs;
    }

    public static toggleSaveRefById(id: number) {
        Ref.getRefById(id).toggleSaveStatus();
    }

    public static getSavedStatusByRef(ref: Ref): boolean {
        return ref.isSaved();
    }

    public static getSpeechIdentifiedByRef(ref: Ref): boolean {
        return ref.isIdentifiedBySpeech();
    }

    public static getAllFavorites(): Ref[] {
        return Ref.allRefs.filter(Ref.getSavedStatusByRef);
    }

    public static getRecentIdentifiedBySpeech(): Ref[] {
        return Ref.allRefs.filter(Ref.getSpeechIdentifiedByRef);
    }

    public static getAllKeywords(): string[] {
        let keywords: string[] = [];
        Ref.allRefs.forEach((ref) => {
            keywords = [...keywords, ...ref.keywords];
        });
        keywords = [...new Set(keywords)]; // only keep distinct keywords
        return keywords;
    }

 };
let ref1 = new Ref(
    "ASCII Table",
    "http://www.asciitable.com/",
    [
    "ASCII values for A-Z are 65-90",
    "ASCII values for a-z are 97-122", 
    "ASCII values for 0-9 are 48-57"
    ],
    ["ascii", "table", "value"],
);
let ref2 = new Ref(
    "Character Methods",
    "https://docs.oracle.com/javase/7/docs/api/java/lang/Character.html",
    [
    "isDigit(char ch)",
    "Determines if the specified character is a digit, returns a boolean.",
    "isUpperCase(char ch)",
    "Determines if the specified character is an uppercase character, returns a boolean."
    ],
    ["character", "digit", "letter", "char"],
);

let ref3 = new Ref(
    "Regular Expressions",
    "https://www.w3schools.com/java/java_regex.asp#:~:text=Metacharacters%20are%20characters%20with%20a%20special%20meaning%3A%20,string%20a%20...%20%204%20more%20rows%20",
    [
    "Regex",
    "import java.util.regex.Matcher;",
    "import java.util.regex.Pattern;"
    ],
    ["regular", "expression", "regex", "match"],
);
export let references: Array<Ref> = [ref1, ref2, ref3];
export let keywords = JSON.stringify(Ref.getAllKeywords());