package com.p.khajana.vocab.gql.util;

import org.springframework.stereotype.Component;

@Component
public class UniqueIdGenerator {
    
    public static enum PREFIXES{
        WORD("WORD_"), ID("_");

        private final String name;

        PREFIXES(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public String generateUniqueId(PREFIXES prefix){
        return prefix.getName()+System.currentTimeMillis();
    }
}
