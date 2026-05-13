package com.Project.Civic_Service.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    public JwtAuthenticationFilter(JwtService jwtService){
        this.jwtService=jwtService;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException

    {
       final  String authHeader = request.getHeader("Authorization");
       final String jwt;
       final String userPhoneNumber;
       if(authHeader==null || !authHeader.startsWith("Bearer ")){
           filterChain.doFilter(request,response);
           return;
       }
       jwt=authHeader.substring(7);
       userPhoneNumber=jwtService.extractPhoneNumber(jwt);
       if(userPhoneNumber != null && SecurityContextHolder.getContext().getAuthentication()==null){
           if(jwtService.isTokenValid(jwt)){
               String role=jwtService.extractRole(jwt);
               UsernamePasswordAuthenticationToken authToken=new UsernamePasswordAuthenticationToken(
                       userPhoneNumber,null, Collections.singletonList(new SimpleGrantedAuthority(role))
               );
               SecurityContextHolder.getContext().setAuthentication(authToken);
           }
       }
       filterChain.doFilter(request,response);
    }}
