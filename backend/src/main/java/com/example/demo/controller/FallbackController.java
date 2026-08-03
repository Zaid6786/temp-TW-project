package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FallbackController {

    // Forward all non-file requests to index.html
    // Explicit API mappings will take precedence over this wildcard
    @RequestMapping(value = "/**/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}
