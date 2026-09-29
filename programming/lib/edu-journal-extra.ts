// Editorial guides, not company news or claims about real events.
export const extraJournal = [
  {
    slug: 'lich-hoc-vua-suc', title: 'Một lịch học vừa sức để không bỏ cuộc giữa chừng', category: 'Cách học', image: 'presentation-original.png',
    intro: 'Một kế hoạch hữu ích phải vừa với tuần thực tế của bạn, không phải tuần lý tưởng không có việc đột xuất.',
    sections: [
      ['Bắt đầu từ thời gian thật sự có', 'Đánh dấu những khoảng bạn có thể tập trung, rồi chọn hai hoặc ba buổi ngắn để thử trước. Đừng lấp kín toàn bộ thời gian trống. Một buổi học cần có điểm kết thúc rõ ràng, chẳng hạn viết được một hàm và tự kiểm tra ba đầu vào, thay vì “học hết JavaScript”.'],
      ['Mỗi buổi có một sản phẩm nhỏ', 'Trước khi mở tài liệu, ghi câu hỏi muốn trả lời. Đọc một phần vừa đủ, đóng hướng dẫn và tự viết lại ví dụ. Cuối buổi lưu đoạn code cùng một ghi chú: điều đã hiểu, lỗi đã gặp và việc sẽ làm tiếp. Ghi chú này giúp buổi sau bắt đầu ngay mà không phải nhớ lại toàn bộ.'],
      ['Điều chỉnh thay vì học bù vô hạn', 'Nếu bỏ lỡ một buổi, tiếp tục từ mục tiêu nhỏ nhất còn dang dở. Đừng tự động gấp đôi thời lượng buổi tiếp theo. Cuối tuần xem điều gì khiến lịch khó giữ: mục tiêu quá lớn, tài liệu quá khó hay khoảng thời gian không phù hợp. Chỉ đổi một yếu tố rồi quan sát tuần tới.'],
    ],
    exercise: 'Chọn hai buổi trong tuần tới. Với mỗi buổi, ghi một việc hoàn thành được và một cách kiểm tra kết quả.', href: '/roadmaps', cta: 'Chọn lộ trình học',
  },
  {
    slug: 'doc-tai-lieu-chu-dong', title: 'Đọc tài liệu mà không chỉ sao chép ví dụ', category: 'Cách học', image: 'presentation-original.png',
    intro: 'Tài liệu trở nên dễ dùng hơn khi bạn mang theo một câu hỏi, một giả thuyết và một ví dụ nhỏ để thử.',
    sections: [
      ['Tìm đúng phần cho câu hỏi hiện tại', 'Ghi rõ thao tác đang cần làm và dữ liệu đầu vào. Trong tài liệu, tìm mục mô tả thao tác đó, kiểm tra điều kiện sử dụng và giá trị trả về. Chú ý phiên bản tài liệu có khớp môi trường của dự án không. Không cần đọc hết mọi tùy chọn trước khi thử trường hợp đơn giản.'],
      ['Đổi một yếu tố trong ví dụ', 'Chạy ví dụ gốc để biết môi trường hoạt động, sau đó thay một giá trị. Với thao tác lọc danh sách, thử danh sách rỗng, danh sách không có phần tử phù hợp và danh sách có nhiều kết quả. Dự đoán trước mỗi lần chạy. Nếu kết quả khác dự đoán, quay lại đoạn mô tả có liên quan.'],
      ['Ghi chú bằng lời của mình', 'Thay vì lưu cả trang, ghi ba ý: dùng khi nào, ví dụ tối thiểu và một điều dễ nhầm. Gắn đường dẫn tài liệu chính thức để tra lại. Sau đó thử áp dụng vào một bài khác; nếu chỉ làm được khi nhìn nguyên ví dụ, bạn còn cần thêm một vòng thực hành.'],
    ],
    exercise: 'Chọn một hàm bạn vừa học. Viết ví dụ với ba đầu vào khác nhau và giải thích kết quả mà không chép mô tả từ tài liệu.', href: '/resources', cta: 'Khám phá tài nguyên',
  },
  {
    slug: 'hoc-nhom-co-muc-tieu', title: 'Học nhóm có mục tiêu, không chỉ cùng ngồi code', category: 'Cộng đồng', image: 'presentation-original.png',
    intro: 'Một buổi học chung nên kết thúc bằng điều mỗi người tự giải thích hoặc tự làm được, không chỉ một đoạn code chạy trên máy của ai đó.',
    sections: [
      ['Thống nhất một bài toán nhỏ', 'Trước buổi học, gửi đề bài và điều cần chuẩn bị. Chọn phạm vi đủ để mọi người cùng thảo luận: một hàm, một màn hình hoặc một lỗi cụ thể. Mỗi người thử suy nghĩ riêng trước khi xem lời giải của nhóm để có câu hỏi và giả thuyết của mình.'],
      ['Luân phiên người viết và người kiểm tra', 'Người viết giải thích ý định trước khi sửa; người còn lại đặt câu hỏi về giả định, trường hợp biên và cách kiểm chứng. Đổi vai sau một mốc nhỏ. Khi bất đồng, tạo ví dụ hoặc test để kiểm tra thay vì quyết định theo người nói tự tin hơn.'],
      ['Kết thúc bằng bản tóm tắt chung', 'Ghi lại ý tưởng đã chọn, trường hợp đã thử và vấn đề còn mở. Để một người không trực tiếp viết code giải thích lại lời giải. Nếu chưa rõ, nhóm thu nhỏ ví dụ và làm lại bước đó. Chia sẻ phần code có thể công khai, không đưa thông tin đăng nhập hay dữ liệu riêng vào cuộc trao đổi.'],
    ],
    exercise: 'Rủ một bạn giải cùng một bài nhỏ. Đổi vai sau lần chạy thử đầu tiên và mỗi người viết hai câu giải thích lời giải.', href: '/extracurriculars/code-together', cta: 'Khám phá học cùng nhau',
  },
  {
    slug: 'phan-hoi-code-huu-ich', title: 'Góp ý code cụ thể để người nhận biết sửa từ đâu', category: 'Cộng đồng', image: 'presentation-original.png',
    intro: 'Một nhận xét hữu ích chỉ ra hành vi quan sát được, lý do cần quan tâm và cách kiểm chứng thay đổi.',
    sections: [
      ['Nhận xét vào vấn đề, không vào người', 'Thay “viết thế này khó hiểu” bằng “đoạn này vừa đổi dữ liệu vừa hiển thị kết quả, mình chưa rõ phần nào chịu trách nhiệm xử lý lỗi”. Nêu đúng đoạn hoặc tình huống đang nói tới. Khi thiếu bối cảnh, hỏi về mục tiêu trước khi yêu cầu đổi cách làm.'],
      ['Phân biệt lỗi và sở thích', 'Ưu tiên lỗi kết quả, mất dữ liệu và luồng người dùng bị chặn. Những lựa chọn như tên biến hoặc cách chia hàm cần dựa trên quy ước nhóm và khả năng đọc hiểu. Nếu chỉ là một phương án khác, nói rõ đó là gợi ý, không coi sở thích cá nhân là lỗi bắt buộc sửa.'],
      ['Đưa cách kiểm chứng', 'Với lỗi xử lý danh sách rỗng, kèm đầu vào và kết quả mong đợi. Với vấn đề giao diện, mô tả kích thước màn hình và thao tác gây lỗi. Sau khi sửa, chạy lại đúng tình huống rồi kiểm tra một trường hợp bình thường để tránh làm hỏng hành vi đã có.'],
    ],
    exercise: 'Chọn một nhận xét chung chung và viết lại thành ba phần: quan sát, tác động và cách kiểm tra.', href: '/extracurriculars/code-review', cta: 'Tìm hiểu buổi review code',
  },
  {
    slug: 'chuan-bi-demo-du-an', title: 'Chuẩn bị một bản demo ngắn nhưng đủ thuyết phục', category: 'Dự án', image: 'presentation-original.png',
    intro: 'Demo tốt cho người xem hiểu vấn đề, thấy luồng chính hoạt động và biết rõ sản phẩm đang có giới hạn gì.',
    sections: [
      ['Kể một tình huống sử dụng', 'Mở đầu bằng một nhu cầu cụ thể, rồi thực hiện luồng giải quyết nhu cầu đó. Với công cụ ghi chi tiêu, hãy thêm một khoản và xem tổng thay đổi. Không cần đi qua mọi nút trên màn hình. Mỗi thao tác nên trả lời được câu hỏi: người dùng nhận được điều gì?'],
      ['Chuẩn bị dữ liệu và phương án dự phòng', 'Dùng dữ liệu mẫu đã kiểm tra, đóng thông báo cá nhân và không để khóa bí mật xuất hiện trên màn hình. Chạy thử từ trạng thái khởi đầu giống lúc trình bày. Nếu phụ thuộc mạng, chuẩn bị ảnh hoặc video ngắn và nói rõ đó là bản ghi khi phải dùng đến; không giả vờ đó là thao tác trực tiếp.'],
      ['Nói rõ điều đã làm và điều chưa làm', 'Kết thúc bằng một quyết định kỹ thuật đáng chú ý, một giới hạn hiện tại và bước tiếp theo. Không gọi dữ liệu mẫu là khách hàng thật hoặc tính năng dự kiến là đã hoàn thành. Khi nhận câu hỏi chưa có đáp án, ghi lại cách bạn sẽ kiểm tra thay vì đoán.'],
    ],
    exercise: 'Viết kịch bản demo gồm: vấn đề, ba thao tác chính, một giới hạn và một câu hỏi bạn muốn người xem góp ý.', href: '/extracurriculars/demo-story', cta: 'Khám phá hoạt động demo',
  },
  {
    slug: 'kiem-thu-truong-hop-bien', title: 'Tìm trường hợp biên trước khi bấm nộp bài', category: 'Thực hành', image: 'presentation-original.png',
    intro: 'Ví dụ trong đề giúp hiểu yêu cầu, nhưng thường chưa đủ để phát hiện những giả định sai trong lời giải.',
    sections: [
      ['Biến giới hạn đề bài thành câu hỏi', 'Đọc lại miền giá trị và kích thước đầu vào. Danh sách có được rỗng không? Có phần tử trùng không? Có số âm không? Chỉ tạo trường hợp nằm trong điều kiện đề cho phép. Nếu đề không rõ, ghi giả định và hỏi lại thay vì tự âm thầm chọn cách hiểu thuận tiện.'],
      ['Chia thành những nhóm nhỏ', 'Với bài tìm một phần tử, thử có đáp án ở đầu, ở cuối và không có đáp án nếu hợp lệ. Với bài tổng, thử một phần tử, nhiều phần tử bằng nhau và giá trị ở giới hạn. Chọn ví dụ nhỏ để có thể tính tay kết quả, thay vì tạo ngay một đầu vào rất dài mà không biết đáp án đúng.'],
      ['Giữ lại ca lỗi làm kiểm thử hồi quy', 'Khi tìm thấy lỗi, rút đầu vào xuống trường hợp nhỏ nhất vẫn tái hiện được. Sửa nguyên nhân rồi chạy lại ca đó cùng các ca cũ. Ghi ngắn gọn giả định nào đã sai. Qua nhiều bài, danh sách này trở thành bộ câu hỏi kiểm tra hữu ích cho chính bạn.'],
    ],
    exercise: 'Lấy một bài vừa giải. Viết năm đầu vào hợp lệ, tính tay kết quả mong đợi và chỉ chạy code sau khi ghi xong.', href: '/dashboard#practice', cta: 'Mở kho bài tập',
  },
];
