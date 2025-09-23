package postsController

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/HAHLIK/image-board/internal/models"
	"github.com/HAHLIK/image-board/internal/storage"
	"github.com/HAHLIK/image-board/pkg/errwrapper"
	"github.com/gin-gonic/gin"
)

type PostsService interface {
	GetPostsBatch(ctx context.Context, offset int64, limit int64) (models.Posts, error)
	SavePost(ctx context.Context, post *models.Post) (int64, error)
}

type Controller struct {
	PostsService PostsService
	router       *gin.Engine
	log          *slog.Logger
}

func New(postsService PostsService, log *slog.Logger) *Controller {
	return &Controller{
		PostsService: postsService,
		router:       gin.New(),
		log:          log,
	}
}

func (c *Controller) Run(addr string) error {
	const op = "postsController.Run"

	c.router.GET("/", c.Posts)
	c.router.POST("/", c.Post)

	if err := c.router.Run(addr); err != nil {
		return errwrapper.Wrap(op, err)
	}

	return nil
}

func (c *Controller) Posts(ctx *gin.Context) {
	const op = "postsController.Posts"
	log := c.log.With("op", op)

	log.Info("request")

	offset, _ := strconv.Atoi(ctx.Query("offset"))
	limit, _ := strconv.Atoi(ctx.Query("limit"))

	if offset < 0 {
		log.Info("offset < 0")
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "offset must be positive or zero"})
		return
	}
	if limit <= 0 {
		log.Info("limit <= 0")
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "limit must be positive"})
		return
	}

	posts, err := c.PostsService.GetPostsBatch(ctx.Request.Context(), int64(offset), int64(limit))
	if err != nil {
		if !errors.Is(err, storage.ErrPostsNotFound) {
			log.Error("can't get posts")
			ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "can't get posts"})
			return
		}
		log.Info("posts not found")
	}

	log.Info(fmt.Sprintf("response code: %v", http.StatusOK))
	ctx.IndentedJSON(http.StatusOK, posts)
}

func (c *Controller) Post(ctx *gin.Context) {
	const op = "postsController.SavePost"
	log := c.log.With("op", op)

	log.Info("request")

	post := &models.Post{}
	if err := ctx.BindJSON(&post); err != nil {
		log.Info("can't bind json to object")
		ctx.IndentedJSON(http.StatusBadRequest, nil)
		return
	}

	id, err := c.PostsService.SavePost(ctx.Request.Context(), post)
	if err != nil {
		log.Info("can't save post")
		ctx.IndentedJSON(http.StatusInternalServerError, nil)
		return
	}

	log.Info(fmt.Sprintf("response code: %v", http.StatusOK))
	ctx.IndentedJSON(http.StatusOK, id)
}
