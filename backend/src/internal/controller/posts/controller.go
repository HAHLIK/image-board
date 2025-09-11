package postsController

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/HAHLIK/image-board/internal/models"
	"github.com/HAHLIK/image-board/pkg/errwrapper"
	"github.com/gin-gonic/gin"
)

type PostsService interface {
	GetPostsBatch(ctx context.Context, offset int64, limit int) (models.Posts, error)
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

	if err := c.router.Run(addr); err != nil {
		return errwrapper.Wrap(op, err)
	}

	return nil
}

func (c *Controller) Posts(ctx *gin.Context) {
	const op = "postsController.Posts"
	log := c.log.With("op", op)

	log.Info("request")

	offset := ctx.GetInt64("offset")
	limit := ctx.GetInt("limit")

	if offset <= 0 {
		log.Info("offset <= 0")
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "offset must be positive"})
		return
	}
	if limit <= 0 {
		log.Info("limit <= 0")
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "limit must be positive"})
		return
	}

	posts, err := c.PostsService.GetPostsBatch(ctx.Request.Context(), offset, limit)
	if err != nil {
		log.Error("can't get posts")
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "can't get posts"})
		return
	}

	log.Info(fmt.Sprintf("response code: %v", http.StatusOK))
	ctx.IndentedJSON(http.StatusOK, posts)
}
