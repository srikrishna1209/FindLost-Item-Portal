package com.krishna.lostfoundportal.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI lostFoundOpenAPI() {

        return new OpenAPI()

                .info(new Info()

                        .title("Lost & Found Portal API")

                        .description("REST API for Lost & Found Portal built using Spring Boot")

                        .version("1.0.0")

                        .contact(new Contact()
                                .name("Krishna")
                                .email("your-email@example.com"))

                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))

                .externalDocs(new ExternalDocumentation()
                        .description("Project Documentation")
                        .url("https://github.com/your-github"));
    }
}