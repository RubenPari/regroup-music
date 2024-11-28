package io.rubenpari.regroupmusic.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.session.web.context.AbstractHttpSessionApplicationInitializer;

@Configuration
@EnableRedisHttpSession
public class SessionConfig extends AbstractHttpSessionApplicationInitializer {
    @Bean
    public JedisConnectionFactory connectionFactory() {
        JedisConnectionFactory connectionFactory = new JedisConnectionFactory();

        connectionFactory.setHostName("junction.proxy.rlwy.net");
        connectionFactory.setPort(54843);
        connectionFactory.setPassword("PeOZgGkMDvokzyFsQuiBYykBzkPwFNue");
        connectionFactory.setDatabase(0);

        return connectionFactory;
    }
}