package com.chacineria.marcelina.configuracion;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.chacineria.marcelina.entidad.persona.Usuario;
import com.chacineria.marcelina.repositorio.persona.UsuarioRepositorio;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ProvedorDelAuntenticadorDeUsuario {

    @Value("${security.jwt.token.secret-key:secret-value}")
    private String secretKey;

    private final UsuarioRepositorio usuarioRepositorio;

    @PostConstruct
    protected void init(){
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(String usuarioNombre) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3600000); 

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withIssuer(usuarioNombre)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(algorithm);
    }

    public Authentication validateToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        Usuario user = usuarioRepositorio.findByUsuarioNombre(decoded.getIssuer());

        return new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
    }
}
