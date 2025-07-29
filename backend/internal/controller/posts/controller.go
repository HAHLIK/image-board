package postsController

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/HAHLIK/image-board/internal/models"
	"github.com/HAHLIK/image-board/internal/pkg/errwrapper"
	"github.com/gin-gonic/gin"
)

type PostsService interface {
	GetPosts() (models.Posts, error)
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

	responceCode := http.StatusOK

	posts, err := c.PostsService.GetPosts()
	if err != nil {
		responceCode = http.StatusInternalServerError
		log.Error("can't get posts")
	}

	log.Info(fmt.Sprintf("responce code: %v", responceCode))
	ctx.IndentedJSON(http.StatusOK, posts)
}
