function toSnakeCase(word : string) : string
{
    word = word[0].toLowerCase() + word.substr(1, word.length - 1);
    // this makes the first alphabet lpwercase
    let newWord : string = "";
    for(let character of word)
    {
        if(character === character.toUpperCase())
        {
            newWord+= "_" + character.toLowerCase();
        }
        else
        {
            newWord += character;
        }
    }
    return newWord;
}

function toCamelCase(word :string) : string 
{
    let newWord : string  = "";
    let underscore : boolean = false;
    for(let character of word)
    {
        if(character === "_")
        {
            underscore = true;
            continue;
        }
        if(underscore)
        {
            newWord += character.toUpperCase();
            underscore = false;
        }
        else
        {
            newWord += character;
        }
    }
    return newWord;
}

export { toSnakeCase, toCamelCase };