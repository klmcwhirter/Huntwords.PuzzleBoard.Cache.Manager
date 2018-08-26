#!/bin/bash

JQ='[
    .[] |
        {
            name,
            description,
            type: (
                if (.name == "Random" or .name == "Word") then (.name | ascii_downcase)
                else "static"
                end
            ),
            puzzleWords: (
                if (.name == "Word") then ["word"]
                else [.puzzleWords[].word]
                end
            )
        }
] | sort_by(.name) |
    map( { (.name|tostring): . } ) | add |
    keys[] as $k | "\($k) \(.[$k])"
'
jq -M -r "${JQ}" puzzles-all.json |
sed 's/"/\\"/g' |
awk '
{
    key=$1;
    keys[key]=key;
    $1="";
    printf("SET \"urn:puzzle:%s\" \"%s\"\r\n", key, $0);
}
#END {
#    printf("DEL \"ids:Puzzle\"\r\n");
#    for(k in keys) {
#        printf("SADD \"ids:Puzzle\" \"%s\"\r\n", k);
#    }
'