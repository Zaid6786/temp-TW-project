package com.example.demo;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Disabled in CI because DB is not available")
class TeamprojectCollegebusApplicationTests {

	@Test
	void contextLoads() {
	}

}
