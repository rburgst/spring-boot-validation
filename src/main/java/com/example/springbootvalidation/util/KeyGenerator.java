package com.example.springbootvalidation.util;

import com.github.f4b6a3.ulid.UlidCreator;

public class KeyGenerator {
    public static String next() {
        return UlidCreator.getUlid().toString();
    }
}
