export class Ref {
    private static numRefs: number = 0;
    private static allRefs: Array<Ref> = [];
    private static libraryInitiated: boolean = false;
    private id: number;
    private refName: string;
    private sourceLink: string;
    private infoToDisplay: string[];
    private keywords: string[];
    private open: boolean = false;
    private saved: boolean = false;
    private new: boolean = true;
    private example?: string;
    private identifiedFromSpeech: boolean = false;
    private timeLastHeard: Date = new Date(); // sets date when initialized, but won't be used

    public constructor (refName: string, keywords: string[], sourceLink: string, infoToDisplay: string[], example?: string) {
        this.id = Ref.numRefs++;
        this.refName = refName;
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
        return this.refName;
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
        if (!Ref.libraryInitiated) {
            initiateReferenceLibrary();
        }
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

export let keywords = JSON.stringify(Ref.getAllKeywords());

function initiateReferenceLibrary() {
    // Scanner Refs
    new Ref( // 1
        "Scanner",
        ["scanner", "input", "read"],
        "https://www.geeksforgeeks.org/scanner-class-in-java/",
        [
        "You can use the Scanner class to obtain the input of primative data types (int, double, etc.) and strings.",
        ],
    );
    new Ref( // 2
        "Scanner: Import",
        ["scanner", "input", "read", "import"],
        "https://www.programiz.com/java-programming/scanner",
        [
        "To use the scanner class, the package must first be imported using: ",
        "import java.util.Scanner;"
        ],
    );
    new Ref( // 3
        "Scanner: Methods",
        ["scanner", "input", "read", "method", "methods"],
        "https://www.w3schools.com/java/java_user_input.asp",
        [
        "The Scanner can read in different data types by using different Scanner methods. ",
        "These methods are: nextBoolean(), nextByte(), nextDouble(), nextFloat(), nextInt(), nextLine(), nextLong(), nextShort()"
        ],
    );
    new Ref( // 4
        "Scanner: Declare",
        ["scanner", "create", "read", "declare", "input", "stream"],
        "https://www.programiz.com/java-programming/scanner",
        [
        "A Scanner object must first be created before it can be used to read input.",
        "Scanners can read input from a variety of places such as the InputStream, a File, and a String.",
        "To create a Scanner object to read user input, use:", 
        "Scanner scannerName = new Scanner(System.in);"
        ],
    );
    new Ref( // 5
        "Scanner: User Input",
        ["scanner", "user", "read", "input"],
        "https://www.programiz.com/java-programming/scanner",
        [
        "Scanners can read in values from the user as strings, characters, integers, and doubles.",
        "To read a String value from the user and set it to a String object use:",
        "String stringName = scannerName.nextLine();", 
        ],
    );

    // String methods

    new Ref( // 6
        "String",
        ["string", "declare"],
        "https://docs.oracle.com/javase/7/docs/api/java/lang/String.html",
        [
        "The String class represents character strings. All strings are instances of this class.",
        "Declare a string like this:",
        "String str = \"abc\";", 
        ],
    );

    new Ref( // 7
        "String: charAt()",
        ["string", "character", "index"],
        "https://www.tutorialspoint.com/java/java_strings.htm",
        [
        "Strings contain indexes of characters ranging from 0 to length minus 1.",
        "The charAt() method can be used to return the character at a specific index of a string:",
        "char char1 = stringName.charAt(index)", 
        ],
    );

    new Ref( // 8
        "String: length()",
        ["string", "character", "length", "size", "count"],
        "https://www.tutorialspoint.com/java/java_string_length.htm",
        [
        "Use length() to find the number of characaters in a string:",
        "int stringLength = stringName.length();",
        ],
    );

    new Ref( // 9
        "String: equals()",
        ["string", "equal", "equals", "same", "match"],
        "https://www.w3schools.com/java/ref_string_equals.asp",
        [
        "Use the equals() method to compare two strings",
        "If the strings are equal, it returns true, otherwise it returns false.",
        "boolean equalStrings = str1.equals(str2);",
        ],
    );

    new Ref( // 10
        "String: startsWith()",
        ["string", "starts", "begins"],
        "https://www.w3schools.com/java/ref_string_startswith.asp",
        [
        "The startsWith() method checks whether a string starts with the specified character(s).",
        "Example: String myStr1 = \"Hello\"",
        "myStr1.startsWith(\"Hel\"); //true",
        ],
    );

    new Ref( // 11
        "String: substring()",
        ["string", "substring"],
        "https://www.w3schools.com/java/java_ref_string.asp",
        [
        "The subString() method returns a substring according to start and end indices. Example: ",
        "String myStr1 = \"apple\"",
        "int start = 1",
        "int end = 4",
        "String subStr = myStr1.subString(start, end);",
        "//subStr = \"ppl\""
        ],
    );

    new Ref( // 12
        "String: compareTo()",
        ["string", "compare"],
        "https://www.w3schools.com/java/ref_string_compareto.asp",
        [
        "The compareTo() method compares two strings lexicographically.",
        "The unicode values of each character in the strings are used to compare.",
        "The method returns 0 if the strings are equal.",
        "A negative int is returned if str1 < str2 (less characters)",
        "A positive int is returned if str1 > str2 (more characters)",
        "int i = str1.compareTo(str2)",
        ],
    );

    // Operators

    new Ref( // 13
        "Relational Operators",
        ["operators", "operator", "relation", "less", "greater", "equal", "equals"],
        "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html",
        [
        "equal to: ==",
        "not equal to: !=",
        "less than: <",
        "greater than: >",
        "less than or equal to: <=",
        "greater than or equal to: >=",
        ],
    );

    new Ref( // 14
        "Logical Operators",
        ["operator", "symbol", "logic", "operators"],
        "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html",
        [
        "logical AND: &&",
        "logical OR: ||",
        "logical NOT: !"
        ],
    );

    new Ref( // 14
        "Operators: Equals",
        ["operator", "symbol", "operators", "equal", "equals", "check"],
        "https://www.tutorialspoint.com/java/java_basic_operators.htm",
        [
        "The equality operator is represented by '=='.",
        "The statement will return true if two variables are equal.",
        "Note: do not use this to check string equality. Use .equals() instead.",
        "ex: if (var1 == var2) { // do something } ",
        ],
    );

    new Ref( // 15
        "Operators: Less Than",
        ["operator", "operators", "less", "smaller", "check", "compare"],
        "https://www.tutorialspoint.com/java/java_basic_operators.htm",
        [
        "The '<' operator checks if the value on the left is less than the value on the right.",
        "If the value on the left is less, than it returns true.",
        "  if (var1 < var2) { // var1 is less}"
        ],
    );

    new Ref( // 16
        "Operators: Greater Than",
        ["operator", "operators", "greater", "larger", "bigger", "check", "compare"],
        "https://www.tutorialspoint.com/java/java_basic_operators.htm",
        [
        "The '>' operator checks if the value on the left is greater than the right.",
        "If the value on the left is greater, than it returns true.",
        "  if (var1 > var2) { // var1 is bigger}"
        ],
    );

    new Ref( // 17
        "Operators: AND",
        ["operator", "operators", "logical", "check", "both", "logic"],
        "https://www.geeksforgeeks.org/java-logical-operators-with-examples/",
        [
        "The logical AND operator is signified with '&&'.",
        "It will return true only when both conditions are satisfied.", 
        "  if (condition1 && condition2) // both conditions are true"
        ],
    );

    new Ref( // 18
        "Operators: OR",
        ["operator", "logical", "operators", "logic", "check"],
        "https://www.geeksforgeeks.org/java-logical-operators-with-examples/",
        [
        "The logical OR operator is signified with '||'.",
        "The operator will return true if at least one of the conditions is true.",
        "ex: if (condition1 || condition2) // one or both are true ",
        ],
    );

    // Exceptions/Errors


    new Ref(
        "ASCII Table",
        ["ascii", "table", "value"],
        "http://www.asciitable.com/",
        [
        "ASCII values for A-Z are 65-90",
        "ASCII values for a-z are 97-122", 
        "ASCII values for 0-9 are 48-57"
        ],
    );
    new Ref(
        "Character Methods",
        ["character", "digit", "letter", "char"],
        "https://docs.oracle.com/javase/7/docs/api/java/lang/Character.html",
        [
        "isDigit(char ch)",
        "Determines if the specified character is a digit, returns a boolean.",
        "isUpperCase(char ch)",
        "Determines if the specified character is an uppercase character, returns a boolean."
        ],
    );
    
    new Ref(
        "Regular Expressions",
        ["regular", "expression", "regex", "match"],
        "https://www.w3schools.com/java/java_regex.asp#:~:text=Metacharacters%20are%20characters%20with%20a%20special%20meaning%3A%20,string%20a%20...%20%204%20more%20rows%20",
        [
        "Regex",
        "import java.util.regex.Matcher;",
        "import java.util.regex.Pattern;"
        ],
    );
}