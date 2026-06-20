import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
KNOWLEDGE_PATH = ROOT / "public" / "curriculum_knowledge.json"
LESSONS_PATH = ROOT / "public" / "curriculum_chapter_lessons.json"


GENERIC_DISTRACTORS = [
    "Chỉ mô tả hiện tượng bề ngoài mà không cần phân tích quan hệ kinh tế bên trong.",
    "Chủ yếu hướng đến ghi nhớ thuật ngữ, không cần đặt trong bối cảnh lịch sử cụ thể.",
    "Tách rời vấn đề kinh tế khỏi quan hệ xã hội và điều kiện phát triển của sản xuất.",
    "Xem thị trường hoặc chính sách như yếu tố tự phát, không chịu tác động của quy luật khách quan.",
    "Đồng nhất mọi hình thái kinh tế mà không xét sự khác nhau về sở hữu, lợi ích và tổ chức sản xuất.",
    "Chỉ nhấn mạnh lợi ích cá nhân trước mắt, không xét quan hệ với lợi ích xã hội rộng hơn.",
]


APPLICATION_STEMS = [
    "Khi vận dụng mục '{heading}' vào thực tiễn học tập, cách hiểu nào hợp lý nhất?",
    "Nếu cần liên hệ mục '{heading}' với đời sống kinh tế hiện nay, lựa chọn nào phù hợp nhất?",
    "Trong ôn tập mục '{heading}', thao tác tư duy nào nên được ưu tiên?",
    "Khi phân tích một tình huống theo mục '{heading}', người học cần chú ý điều gì?",
]


def first_sentence(text: str) -> str:
    text = " ".join(text.split())
    for marker in [". ", "? ", "! "]:
        if marker in text:
            return text.split(marker, 1)[0].strip() + marker.strip()
    return text


def trim(text: str, limit: int = 165) -> str:
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(" ", 1)[0].rstrip(",.;:")
    return f"{cut}..."


def rotate_options(correct: str, distractors: list[str], seed: int) -> tuple[list[str], int]:
    options = [correct] + distractors[:3]
    # Deterministic rotation so the correct answer is not always A.
    shift = seed % 4
    options = options[shift:] + options[:shift]
    correct_index = options.index(correct)
    return options, correct_index


def unique_distractors(candidates: list[str], correct: str) -> list[str]:
    result = []
    normalized_correct = correct.lower().strip()
    for candidate in candidates + GENERIC_DISTRACTORS:
        value = trim(candidate)
        if value.lower().strip() == normalized_correct:
            continue
        if value not in result:
            result.append(value)
        if len(result) >= 3:
            break
    return result


def make_question(qid: str, chapter_id: int, question: str, correct: str, distractors: list[str], explanation: str, seed: int) -> dict:
    options, correct_answer = rotate_options(trim(correct), unique_distractors(distractors, correct), seed)
    return {
        "id": qid,
        "chapter": chapter_id,
        "question": question,
        "options": options,
        "correctAnswer": correct_answer,
        "explanation": explanation,
    }


def build_quiz_bank(lessons: list[dict]) -> list[dict]:
    questions = []
    global_index = 1

    for lesson in lessons:
        chapter_id = lesson["chapterId"]
        points = lesson["keyPoints"]
        point_summaries = [point["text"] for point in points if point.get("text")]
        point_headings = [point["heading"] for point in points]

        for point_index, point in enumerate(points, start=1):
            heading = point["heading"]
            details = point.get("details") or [point["text"]]
            other_summaries = [text for text in point_summaries if text != point["text"]]
            other_headings = [name for name in point_headings if name != heading]

            local_items = [
                (
                    f"Mục '{heading}' của chương {chapter_id} nhấn mạnh nội dung nào?",
                    point["text"],
                    other_summaries,
                    f"Mục '{heading}' tập trung vào ý: {point['text']}",
                ),
                (
                    f"Nhận định nào phù hợp nhất với mục '{heading}'?",
                    first_sentence(details[0]),
                    [first_sentence(detail) for detail in details[1:]] + other_summaries,
                    f"Đáp án đúng bám sát phần chi tiết của mục '{heading}': {first_sentence(details[0])}",
                ),
                (
                    f"Khi học mục '{heading}', người học cần tránh nhầm lẫn điều gì?",
                    "Không nên chỉ học thuộc từ khóa rời rạc mà cần hiểu bản chất, bối cảnh và quan hệ kinh tế được nêu trong mục này.",
                    [
                        "Chỉ cần nhớ tên mục là đủ để hiểu toàn bộ nội dung chương.",
                        "Có thể bỏ qua bối cảnh lịch sử vì các phạm trù kinh tế luôn bất biến.",
                        "Không cần liên hệ mục này với các mục khác trong cùng chương.",
                    ],
                    f"Mục '{heading}' cần được hiểu trong mối liên hệ với nội dung chung của chương, không học như một mảnh kiến thức rời.",
                ),
                (
                    APPLICATION_STEMS[(point_index - 1) % len(APPLICATION_STEMS)].format(heading=heading),
                    "Phân tích khái niệm trong quan hệ với điều kiện lịch sử, chủ thể kinh tế và tác động thực tiễn của nó.",
                    [
                        "Tách khái niệm khỏi bối cảnh và chỉ ghi nhớ một câu định nghĩa ngắn.",
                        "Chỉ so sánh câu chữ giữa các mục mà không cần hiểu nội dung.",
                        "Ưu tiên học mẹo đáp án hơn là hiểu vì sao đáp án đúng.",
                    ],
                    f"Vận dụng mục '{heading}' cần đi từ bản chất lý luận đến liên hệ thực tiễn, đúng tinh thần học giáo trình.",
                ),
            ]

            for detail_index, detail in enumerate(details[:4], start=1):
                local_items.append(
                    (
                        f"Chi tiết nào sau đây đúng với mục '{heading}'?",
                        detail,
                        [d for d in details if d != detail] + other_summaries,
                        f"Giáo trình diễn giải mục '{heading}' theo hướng: {first_sentence(detail)}",
                    )
                )

            while len(local_items) < 8:
                related = other_headings[(len(local_items) + point_index) % len(other_headings)] if other_headings else "mục khác"
                local_items.append(
                    (
                        f"Mục '{heading}' có quan hệ học tập gần nhất với nội dung nào trong cùng chương?",
                        f"Nó cần được đặt trong mạch chung của chương và liên hệ với mục '{related}' để hiểu đầy đủ hơn.",
                        [
                            f"Nó hoàn toàn tách rời mục '{related}' và không cần học cùng chương.",
                            "Nó chỉ là ví dụ minh họa, không ảnh hưởng đến nội dung lý luận chính.",
                            "Nó chỉ phục vụ phần ghi nhớ thuật ngữ, không liên quan đến vận dụng.",
                        ],
                        f"Các mục trong chương {chapter_id} bổ sung cho nhau; mục '{heading}' nên được học cùng mạch với các mục còn lại.",
                    )
                )

            for item_index, (question, correct, distractors, explanation) in enumerate(local_items[:8], start=1):
                qid = f"c{chapter_id:02d}q{((point_index - 1) * 8 + item_index):02d}"
                questions.append(
                    make_question(
                        qid=qid,
                        chapter_id=chapter_id,
                        question=question,
                        correct=correct,
                        distractors=distractors,
                        explanation=explanation,
                        seed=global_index,
                    )
                )
                global_index += 1

    return questions


def main() -> None:
    knowledge = json.loads(KNOWLEDGE_PATH.read_text(encoding="utf-8"))
    lessons = json.loads(LESSONS_PATH.read_text(encoding="utf-8"))

    knowledge["quiz_questions"] = build_quiz_bank(lessons)
    KNOWLEDGE_PATH.write_text(json.dumps(knowledge, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    counts = {}
    for question in knowledge["quiz_questions"]:
        counts[question["chapter"]] = counts.get(question["chapter"], 0) + 1

    print(f"Updated {KNOWLEDGE_PATH.name} with {len(knowledge['quiz_questions'])} quiz questions.")
    print("Counts by chapter:", dict(sorted(counts.items())))


if __name__ == "__main__":
    main()
