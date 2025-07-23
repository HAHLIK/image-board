package endpoints

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Dummy(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"message": "hello world",
	})
}
