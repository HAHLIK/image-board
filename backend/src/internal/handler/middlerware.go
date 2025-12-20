package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	autharizationHeader = "Authorization"
	userIdCtx           = "userId"
)

func (h *Handler) userIdentity(ctx *gin.Context) {
	const op = "handler.signIn"
	log := h.log.With("op", op)

	header := ctx.GetHeader(autharizationHeader)
	if header == "" {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "empty auth header"})
		return
	}

	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "invalid auth header"})
		return
	}

	userId, err := h.authService.ParseToken(headerParts[1])
	if err != nil {
		log.Info("could not parse token")
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "could not parse token"})
		return
	}
	ctx.Set(userIdCtx, string(userId))
}
