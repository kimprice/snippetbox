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

    new Ref( // 15
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

    new Ref( // 16
        "Operators: Less Than",
        ["operator", "operators", "less", "smaller", "check", "compare"],
        "https://www.tutorialspoint.com/java/java_basic_operators.htm",
        [
        "The '<' operator checks if the value on the left is less than the value on the right.",
        "If the value on the left is less, than it returns true.",
        "  if (var1 < var2) { // var1 is less}"
        ],
    );

    new Ref( // 17
        "Operators: Greater Than",
        ["operator", "operators", "greater", "larger", "bigger", "check", "compare"],
        "https://www.tutorialspoint.com/java/java_basic_operators.htm",
        [
        "The '>' operator checks if the value on the left is greater than the right.",
        "If the value on the left is greater, than it returns true.",
        "  if (var1 > var2) { // var1 is bigger}"
        ],
    );

    new Ref( // 18
        "Operators: AND",
        ["operator", "operators", "logical", "check", "both", "logic"],
        "https://www.geeksforgeeks.org/java-logical-operators-with-examples/",
        [
        "The logical AND operator is signified with '&&'.",
        "It will return true only when both conditions are satisfied.", 
        "  if (condition1 && condition2) // both conditions are true"
        ],
    );

    new Ref( // 19
        "Operators: OR",
        ["operator", "logical", "operators", "logic", "check"],
        "https://www.geeksforgeeks.org/java-logical-operators-with-examples/",
        [
        "The logical OR operator is signified with '||'.",
        "The operator will return true if at least one of the conditions is true.",
        "ex: if (condition1 || condition2) // one or both are true ",
        ],
    );

    // Regular Expressions

    new Ref( // 20
        "Regular Expressions",
        ["regular", "expression", "regex", "import"],
        "https://www.w3schools.com/Java/java_regex.asp",
        [
        "Regular expressions (RegEx) are a sequence of characters that form a pattern that can be used to search for data within text.",
        "To use regular expressions, include the following import statements:", 
        "import java.util.regex.Matcher;",
        "import java.util.regex.Pattern;",
        ],
    );

    new Ref( // 21
        "RegEx: Pattern",
        ["regular", "expression", "regex", "pattern"],
        "https://www.w3schools.com/Java/java_regex.asp",
        [
        "The pattern class is used to define a pattern that can be later used in a search.",
        "Pattern pattern = Pattern.compile([a-z]);", 
        "This example defines a pattern that has a lowercase character.",
        "Click on the link button for more patterns."
        ],
    );

    new Ref( // 22
        "RegEx: Matcher",
        ["regular", "expression", "regex", "matcher", "match"],
        "https://www.w3schools.com/Java/java_regex.asp",
        [
        "The matcher class is used to search for the pattern within the given string.",
        "Matcher matcher = pattern.matcher(\"check this string\")", 
        "To check if a string contains the pattern, use the find method.", 
        "boolean matchFound = matcher.find();",
        ],
    );

    // ASCII

    new Ref( // 23
        "ASCII Table",
        ["ascii", "table", "value", "uppercase", "lowercase", "number", "letter"],
        "http://www.asciitable.com/",
        [
        "ASCII values are the numerical representation of a character.",
        "ASCII values for A-Z are 65-90",
        "ASCII values for a-z are 97-122", 
        "ASCII values for 0-9 are 48-57"
        ],
    );

    new Ref( // 24
        "ASCII: Find Value",
        ["ascii", "table", "value", "uppercase", "lowercase", "number", "letter"],
        "https://www.javatpoint.com/how-to-print-ascii-value-in-java",
        [
        "To find the numerical value of a given character you must type case a char variable to an int variable",
        "char letter = 'a';",
        "int value = letter; // value is the ASCII number for a", 
        ],
    );

    // Output
    
    new Ref( // 25
        "Output / Print",
        ["output", "print", "console", "system", "display"],
        "https://www.javatpoint.com/system-out-println-in-java",
        [
        "System.out.print() displays the contents in the parentheses to the user.",
        "System.out.println() does the same but also prints a new line after.",
        "System.out.print(\"Message to be printed\")", 
        ],
    );

    new Ref( // 26
        "Print: Multi-line",
        ["output", "print", "console", "system", "display", "multiple", "long"],
        "https://stackoverflow.com/questions/27408889/java-making-system-out-println-argument-span-multiple-lines/27408961",
        [
        "To print out a string on multiple lines in one statment you need to add \\n at the end of each string line. ",
        "System.out.println(\"This is the first line \\n\" + \"This is the second line\");",
        ],
    );

    // Sets

    new Ref( // 27
        "Sets: Declare",
        ["set", "sets", "declare", "declaring", "initialize", "initializing", "import", "create"],
        "https://www.geeksforgeeks.org/set-in-java/",
        [
        "Sets are an unordered collection of objects in which duplicate elements cannot be stored.",
        "The set interface can be imported using import java.util.*;",
        "Set<Obj> setName = new HashSet<Obj>();",
        ],
    );
    
    new Ref( // 28
        "Sets: Contains",
        ["set", "sets", "contains", "element", "check", "present"],
        "https://www.geeksforgeeks.org/set-contains-method-in-java-with-examples/",
        [
        "The contains method checks whether a specific element is present within a set.",
        "It returns true if the element is in the set, and false if it is not.",
        "boolean inSet = setName.contains(element)",
        ],
    );

    new Ref( // 29
        "Sets: Add",
        ["set", "sets", "add", "adding", "collection", "element"],
        "https://www.geeksforgeeks.org/set-add-method-in-java-with-examples/",
        [
        "To add elements to a set, use the add() method.",
        "Returns true or false, indicating if the element has been successfully added.",
        "setName.add(element);",
        ],
    );

    // Character

    new Ref(
        "Character Methods", // 30
        ["character", "digit", "letter", "char", "method"],
        "https://www.tutorialspoint.com/java/java_characters.htm",
        [
        "The character class contains methods for manipulating characters.",
        "Some useful instance methods: isLetter(), isDigit(), isWhitespace(), isUpperCase(), isLowerCase(), toUpperCase(), toLowerCase(), toString()",
        ],
    );

    new Ref(
        "Character: isLetter()", // 31
        ["character", "letter", "char", "method"],
        "https://www.geeksforgeeks.org/character-class-java/",
        [
        "isLetter() returns true if the given character is a letter.",
        "boolean result = Character.isLetter(charTested);",
        ],
    );

    new Ref(
        "Character: isDigit()", // 32
        ["character", "digit", "char", "method", "number"],
        "https://www.tutorialspoint.com/java/character_isdigit.htm",
        [
        "isDigit() returns true if the given character is a digit.",
        "boolean result = Character.isDigit(charTested);",
        ],
    );

    new Ref(
        "Character: isUpperCase()", // 33
        ["character", "uppercase", "char", "method", "capital"],
        "https://www.tutorialspoint.com/java/character_isuppercase.htm",
        [
        "isUpperCase() returns true if the given character is an uppercase letter.",
        "boolean result = Character.isUpperCase(charTested);",
        ],
    );

    new Ref(
        "Character: isLowerCase()", // 34
        ["character", "lowercase", "char", "method", "small"],
        "https://www.tutorialspoint.com/java/character_islowercase.htm",
        [
        "isLowerCase() returns true if the given character is a lowercase letter.",
        "boolean result = Character.isLowerCase(charTested);",
        ],
    );

    new Ref(
        "Character: isWhiteSpace()", // 35
        ["character", "space", "char", "method"],
        "https://www.tutorialspoint.com/java/character_iswhitespace.htm",
        [
        "isWhiteSpace() returns true if the given character is a whitespace character.",
        "Whitespace characters include the space character (\" \"), new line (\"\\n\"), etc.",
        "boolean result = Character.isWhiteSpace(charTested);",
        ],
    );

    // Conditionals

    new Ref(
        "If Statements", // 36
        ["condition", "if", "case", "condition"],
        "https://www.w3schools.com/java/java_conditions.asp",
        [
        "If statements are used to specify a block of code to be executed it the condition is true.",
        "Condition statements can use the following operators: <, >, ==, !=, &&, ||",
        "if (condition) { // code to be executed if condition is true }",
        ],
    );

    new Ref(
        "If Else Statements", // 37
        ["condition", "if", "else", "condition"],
        "https://www.w3schools.com/java/java_conditions.asp",
        [
        "Else if statements are used to test a new condition if the previous condition is false.",
        "Else statements are used to run code when all previous conditions are false.",
        "if (condition1) {",
        "// code executed if condition1 is true",
        "} else if (condition2) {",
        "// code executed if condition1 is false and condition2 is true",
        "} else { ",
        "// code executed if condition1 and condition2 are false", 
        "}",
        ],
    );

    // Loops
    
    new Ref(
        "For Loop", // 38
        ["loop", "for", "iterate"],
        "https://www.w3schools.com/java/java_for_loop.asp",
        [
        "Use a for loop when you know how many times you want to loop through a block of code.",
        "for (int i = 0; i < 3; i++) { // code }",
        "The code in the brackets will run 3 times in the above example.",
        ],
    );

    new Ref(
        "While Loop", // 39
        ["loop", "while", "iterate"],
        "https://www.w3schools.com/java/java_while_loop.asp",
        [
        "Use a while loop to loop through a block of code while a condition is true.",
        "while (condition) { // code }",
        "The code in the brackets will run until the condition is false.",
        ],
    );
    
    // Arrays

    new Ref(
        "Arrays", // 40
        ["array", "arrays", "iterate", "index", "element"],
        "https://www.w3schools.com/java/java_arrays.asp",
        [
        "Arrays store multiple values in one variable.",
        "To declare an array, use square brackets after the variable type:",
        "int[] ages = {5, 17, 24, 16, 31};",
        "Use the index to access elements in the array. The index starts at 0:",
        "ages[1] // 17"
        ],
    );

    new Ref(
        "Array Iteration", // 41
        ["array", "arrays", "iterate", "loop", "element"],
        "https://www.w3schools.com/java/java_arrays.asp",
        [
        "Use a for loop to iterate through an array",
        "for (int i = 0; i < array.length; i++) { ",
        "System.out.print(array[i]); }",
        ],
    );

    new Ref(
        "Break", // 42
        ["break", "loop", "exit", "stop"],
        "https://www.w3schools.com/java/java_break.asp",
        [
        "The break statement is used to exit out of a loop:",
        "for (int i = 0; i < array.length; i++) { ",
        "if (array[i]) > 7) { break; } }",
        "If the condition is true, it will exit out of the for loop and not run any more iterations."
        ],
    );

    new Ref(
        "Continue", // 43
        ["continue", "loop", "exit", "stop", "iterate", "jump", "skip"],
        "https://www.w3schools.com/java/java_break.asp",
        [
        "The continue statement is used to exit out of one iteration of a loop and continue to the next iteration:",
        "for (int i = 0; i < 5; i++) { ",
        "if (i == 3) { continue; }",
        "System.out.print(i);}",
        "The above code will print: 0124"
        ],
    );

    // Exceptions/Errors

    new Ref(
        "Exception: No Line Found", // 44
        ["exception", "line", "found"],
        "https://stackoverflow.com/questions/7209110/java-util-nosuchelementexception-no-line-found",
        [
        "java.util.NoSuchElementException: No line found",
        "If you call nextLine() more times than the number of lines this exception will be thrown.",
        "Before using nextLine(), check if there is a next line with hasNextLine().",
        "while (scanner.hasNextLine())",
        "{ str = scanner.nextLine(); }",
        ],
    );
}