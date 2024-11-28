package io.rubenpari.regroupmusic.controllers;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

import java.net.URI;

@RestController()
@RequestMapping("/auth")
public class AuthController {

    private final SpotifyApi spotifyApi;
    private final Dotenv dotenv;
    private final HttpSession session;

    public AuthController(HttpSession session) {
        this.dotenv = Dotenv.load();

        String clientId = dotenv.get("SPOTIFY_CLIENT_ID");
        String clientSecret = dotenv.get("SPOTIFY_CLIENT_SECRET");
        URI redirectUri = SpotifyHttpManager.makeUri(dotenv.get("SPOTIFY_REDIRECT_URI"));

        this.spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(redirectUri)
                .build();

        this.session = session;
    }

    @GetMapping("/login")
    public URI login() {
        AuthorizationCodeUriRequest authorizationCodeUriRequest = this.spotifyApi.authorizationCodeUri()
                .state("my-state") // TODO: generate random string
                .scope(this.dotenv.get("SCOPE"))
                .show_dialog(true)
                .build();

        return authorizationCodeUriRequest.execute();
    }

    @GetMapping("/callback")
    public String callback(@RequestParam String code) {
        try {
            AuthorizationCodeRequest tokenResponse = this.spotifyApi.authorizationCode(code)
                    .code(code)
                    .build();

            String accessToken = tokenResponse.execute().getAccessToken();

            session.setAttribute("accessToken", accessToken);

            return "Autorizzazione completata con successo";
        } catch (Exception e) {
            return "Si è verificato un errore durante l'autenticazione";
        }
    }

    @GetMapping("/logout")
    public String logout() {
        session.invalidate();

        return "Disconnessione completata con successo";
    }
}
