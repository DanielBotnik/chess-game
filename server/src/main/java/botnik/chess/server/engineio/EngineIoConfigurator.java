package botnik.chess.server.engineio;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.RequestUpgradeStrategy;
import org.springframework.web.socket.server.standard.TomcatRequestUpgradeStrategy;

@Configuration
@EnableWebSocket
public class EngineIoConfigurator implements WebSocketConfigurer {

    private final EngineIoHandler mEngineIoHandler;

    public EngineIoConfigurator(EngineIoHandler engineIoHandler){
        mEngineIoHandler = engineIoHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry){
        registry.addHandler(mEngineIoHandler,"/socket.io/*").addInterceptors(mEngineIoHandler).setAllowedOrigins("*");
        registry.addHandler(mEngineIoHandler,"/engine.io/*").addInterceptors(mEngineIoHandler).setAllowedOrigins("*");
    }

}
