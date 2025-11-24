package handler

import (
	"errors"
	"net/http"
	"strconv"

	models "github.com/HAHLIK/image-board/domain"
	"github.com/HAHLIK/image-board/internal/service"

	"github.com/gin-gonic/gin"
)

func (h *Handler) posts(ctx *gin.Context) {
	const op = "handler.posts"
	log := h.log.With("op", op)

	offset, _ := strconv.Atoi(ctx.Query("offset"))
	limit, _ := strconv.Atoi(ctx.Query("limit"))

	if offset < 0 {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "offset must be positive or zero"})
		return
	}
	if limit <= 0 {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "limit must be positive"})
		return
	}

	posts, err := h.postsService.GetPostsBatch(ctx.Request.Context(), int64(offset), int64(limit))
	if err != nil {
		if !errors.Is(err, service.ErrPostsNotFound) {
			log.Error("can't get posts")
			ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "can't get posts"})
			return
		}
	}
	ctx.IndentedJSON(http.StatusOK, posts)
}

func (h *Handler) savePost(ctx *gin.Context) {
	const op = "handler.post"
	log := h.log.With("op", op)

	post := &models.Post{}
	if err := ctx.BindJSON(&post); err != nil {
		ctx.IndentedJSON(http.StatusBadRequest, nil)
		return
	}

	id, err := h.postsService.SavePost(ctx.Request.Context(), post)
	if err != nil {
		log.Error("can't save post")
		ctx.IndentedJSON(http.StatusInternalServerError, nil)
		return
	}
	ctx.IndentedJSON(http.StatusCreated, gin.H{"id": id})
}
