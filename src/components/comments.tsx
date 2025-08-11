interface Comment {
    author: string;
    avatar: string;
    content: string;
    likes: string;
  }
  
  interface CommentsProps {
    comments: Comment[];
  }
  
  export function Comments({ comments }: CommentsProps) {
    return (
      <div className="flex-1">
        <h3 className="text-[14px] font-normal mb-4">Top Comments</h3>
        <div className="flex flex-col gap-4">
          {comments.map((comment, index) => (
            <div key={index} className="flex justify-between items-start mb-2">
              <div className="flex">
                <img src={comment.avatar} alt={comment.author} className="w-9 h-9 rounded-full mr-4" />
                <div>
                  <span className="font-normal text-[12px]">{comment.author}</span>
                  <div className="text-[#545454] text-[10px] leading-tight">{comment.content}</div>
                </div>
              </div>
              <span className="text-[#545454] text-[10px] mt-4">{comment.likes}❤️</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  