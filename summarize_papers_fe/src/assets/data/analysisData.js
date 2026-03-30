export const ARTICLE_DATA = {
    title: "Deep Learning trong Genomics: Cách mạng hóa Y học Chính xác thông qua Suy luận Quy mô lớn",
    authors: "TS. Elena Vance, TS. Alan Turing và cộng sự.",
    journal: "Nature Genetics",
    date: "Tháng 10, 2023",

    // Abstract dài và chi tiết hơn
    abstract: "Sự hội tụ của học sâu (deep learning) và giải trình tự gen quy mô lớn đã mở ra một kỷ nguyên mới cho khám phá sinh học. Với sự bùng nổ của dữ liệu giải trình tự thế hệ mới (NGS), việc phân tích hàng tỷ cặp base (base pairs) để tìm ra các biến thể gây bệnh trở thành một thách thức về mặt tính toán. Nghiên cứu này trình bày GenomicTrans, một mô hình dựa trên kiến trúc Transformer được thiết kế để xử lý các chuỗi DNA cực dài. Chúng tôi chứng minh rằng bằng cách sử dụng cơ chế chú ý cục bộ (localized attention), mô hình có thể vượt qua giới hạn về bộ nhớ của các kiến trúc truyền thống, cho phép dự đoán mức độ biểu hiện gen và tác động chức năng của các biến thể di truyền với độ chính xác chưa từng có, ngay cả trong các vùng không mã hóa của bộ gen.",

    // Thêm phần Introduction chi tiết để render bên trái
    introduction: `Dữ liệu gen vốn dĩ có kích thước cực lớn và độ phức tạp cao. Một bộ gen người chứa khoảng 3 tỷ cặp base, và phần lớn các biến thể liên quan đến bệnh tật nằm ở các vùng không mã hóa, nơi các cơ chế điều hòa hoạt động một cách tinh vi. Các phương pháp học máy truyền thống thường gặp khó khăn trong việc nắm bắt các phụ thuộc xa (long-range dependencies) trong chuỗi DNA, nơi một thay đổi nhỏ ở cách xa hàng nghìn base pair có thể ảnh hưởng đến việc phiên mã của một gen đích.

Sự ra đời của các mô hình ngôn ngữ lớn (LLM) đã gợi ý rằng kiến trúc Transformer có thể áp dụng cho 'ngôn ngữ của sự sống'. Tuy nhiên, độ phức tạp tính toán O(N^2) của cơ chế tự chú ý (self-attention) khiến việc xử lý toàn bộ nhiễm sắc thể trở nên bất khả thi trên các phần cứng hiện tại. GenomicTrans giải quyết vấn đề này bằng cách kết hợp cấu trúc phân cấp và cửa sổ chú ý trượt, giúp giảm độ phức tạp xuống mức tuyến tính O(N) mà không làm mất đi thông tin ngữ cảnh quan trọng. 

Trong bài báo này, chúng tôi đánh giá GenomicTrans trên các tập dữ liệu chuẩn từ UK Biobank, tập trung vào khả năng dự đoán các biến thể hiếm gặp và đánh giá khả năng triển khai thực tế trong các hệ thống hỗ trợ quyết định lâm sàng.`,

    highlights: [
        "GenomicTrans giảm độ trễ suy luận xuống 45% so với mô hình SOTA hiện tại.",
        "Cơ chế Localized Attention giúp mô hình xử lý cửa sổ lên tới 1 triệu base pairs.",
        "Đạt chỉ số AUC 0.94 trong việc phân loại các biến thể có hại (pathogenic variants).",
        "Tối ưu hóa khả năng chạy trên các thiết bị Edge-Computing tại phòng xét nghiệm."
    ]
};

export const AI_SUMMARY = {
    readingTime: "2 min",
    wordCount: 420,
    summary: "Dựa trên phân tích chuyên sâu, nghiên cứu này đề xuất một kiến trúc mạng nơ-ron mới nhằm tối ưu hóa việc xử lý dữ liệu genomic quy mô lớn, giúp cải thiện độ chính xác lên 15% so với các phương pháp truyền thống.",
    keywords: ["Deep Learning", "Genomics", "Transformer", "NLP", "Big Data"],
    objectives: [
        "Develop a high-efficiency transformer architecture for genomic analysis.",
        "Overcome computational latency barriers in clinical genomics.",
        "Validate accuracy across UK Biobank and TCGA datasets."
    ],
    metrics: [
        { label: "Architecture", value: "GenomicTrans" },
        { label: "Pre-training", value: "1.2M Sequences" },
        { label: "Inference", value: "Edge-Computing" }
    ]
};