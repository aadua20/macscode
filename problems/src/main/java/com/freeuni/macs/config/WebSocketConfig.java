package com.freeuni.macs.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // Enables a simple in-memory message broker
        config.setApplicationDestinationPrefixes("/app"); // Prefix for messages bound for @MessageMapping
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/websocket-endpoint")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // Fallback option for browsers that don’t support WebSocket
    }
}
