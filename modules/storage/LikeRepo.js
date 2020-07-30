class LikeRepo {
    getLike = (videoId) => {
        if (this.hasOwnProperty(videoId))
            if (this[videoId] != null) {
                let isLiked = this[videoId] ?true :false;
                
                return {
                    isLiked: isLiked,
                    isDisliked: !isLiked
                };
            }
        
        return {
            isLiked: null,
            isDisliked: null
        };
    }

    setLike = (videoId, liked) => {
        this[videoId] = liked;
    }
}

export var LikeRepo = new LikeRepo();