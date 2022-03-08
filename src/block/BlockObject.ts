import YAML from 'yaml';

import { Block } from "src/block/Block";

export abstract class BlockObject extends Block
{
    static objType: string;

    abstract parseObj(obj: any);

    parse(str: string)
    {
        let yaml = str.replace(/^@(.+)$/m, '');
        this.parseObj(YAML.parse(yaml));   
    }

    static canParse(str: string)
    {
        if (!this.objType)
            return false;

        return str.startsWith('@' + this.objType);
    }
}