import './PostWidget.css'

type PostProps = {
    timeStamp: string,
    title: string,
    content: string,
}

function PostWidget(props: PostProps) {
    const {
        timeStamp,
        title,
        content
    } = props

    return (
    <div className='postWidget'>
    <div className="mainBlock">
        <section className="headerSection">
            <p>{timeStamp}</p>
        </section>
        <section className="titleSection">
            <p>{title}</p>
        </section>
        <section className='contentSection'>
            <p>{content}</p>
        </section>
    </div>
    </div>
    )
}

export default PostWidget