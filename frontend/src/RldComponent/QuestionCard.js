import React from "react";
import { Volume2, Mic, Loader2 } from "lucide-react";

function QuestionCard({
  question,
  currentSub,
  showSubQuestions,
  onMediaEnd,
  onRecord,
  isRecording,
  onSpeak,
  transcript,
}) {
  // 🎥 Render the appropriate media type
  const renderMedia = () => {
    switch (question.type) {
      case "video":
        return React.createElement("video", {
          src: question.src,
          controls: true,
          onEnded: onMediaEnd,
          className: "w-full rounded-2xl shadow-lg border-4 border-blue-200",
        });
      case "image":
        return React.createElement("img", {
          src: question.src,
          alt: "Question visual",
          onLoad: onMediaEnd,
          className: "rounded-2xl shadow-lg border-4 border-blue-200",
        });
      case "text":
        return React.createElement(
          "div",
          {
            onLoad: onMediaEnd,
            className:
              "text-lg text-gray-800 bg-yellow-50 p-4 rounded-xl border-2 border-yellow-300",
          },
          question.title
        );
      default:
        return null;
    }
  };

  // 🧱 Layout building
  if (question.type === "image") {
    return React.createElement(
      "div",
      { className: "w-full" },
      React.createElement(
        "div",
        { className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-center" },
        React.createElement("div", null, renderMedia()),
        React.createElement(
          "div",
          null,
          showSubQuestions &&
            React.createElement(
              "div",
              { className: "space-y-4" },
              // Question + Speaker
              React.createElement(
                "div",
                {
                  className:
                    "flex items-center gap-3 bg-yellow-100 rounded-xl p-3 shadow",
                },
                React.createElement(
                  "p",
                  {
                    className: "text-gray-800 font-medium text-lg flex-1",
                  },
                  currentSub
                ),
                React.createElement(
                  "button",
                  {
                    onClick: onSpeak,
                    className:
                      "p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition",
                    title: "Listen",
                  },
                  React.createElement(Volume2, {
                    className: "text-blue-700 w-6 h-6",
                  })
                )
              ),

              // Record button
              React.createElement(
                "button",
                {
                  onClick: onRecord,
                  disabled: isRecording,
                  className:
                    "mt-2 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all " +
                    (isRecording
                      ? "bg-red-500 animate-pulse"
                      : "bg-green-600 hover:bg-green-700"),
                },
                isRecording
                  ? [
                      React.createElement(Loader2, {
                        key: "loader",
                        className: "animate-spin",
                      }),
                      " පටිගත වෙමින්...",
                    ]
                  : [
                      React.createElement(Mic, { key: "mic" }),
                      " පටිගත කිරීම අරඹන්න",
                    ]
              ),

              // Transcript
              transcript &&
                React.createElement(
                  "div",
                  {
                    className:
                      "mt-3 bg-green-50 border border-green-200 p-3 rounded-lg text-green-700 text-sm",
                  },
                  React.createElement("strong", null, "🗣️ ඔබේ පිළිතුර: "),
                  transcript
                )
            )
        )
      )
    );
  }

  // 🎬 For video and text questions
  return React.createElement(
    "div",
    { className: "w-full text-center" },
    React.createElement("div", { className: "mb-6" }, renderMedia()),
    showSubQuestions &&
      React.createElement(
        "div",
        { className: "space-y-4" },
        React.createElement(
          "div",
          {
            className:
              "flex items-center justify-center gap-3 bg-yellow-100 rounded-xl p-3 shadow",
          },
          React.createElement(
            "p",
            { className: "text-gray-800 font-medium text-lg" },
            currentSub
          ),
          React.createElement(
            "button",
            {
              onClick: onSpeak,
              className:
                "p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition",
              title: "Listen",
            },
            React.createElement(Volume2, { className: "text-blue-700 w-6 h-6" })
          )
        ),

        React.createElement(
          "button",
          {
            onClick: onRecord,
            disabled: isRecording,
            className:
              "mt-2 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all " +
              (isRecording
                ? "bg-red-500 animate-pulse"
                : "bg-green-600 hover:bg-green-700"),
          },
          isRecording
            ? [
                React.createElement(Loader2, {
                  key: "loader",
                  className: "animate-spin",
                }),
                " පටිගත වෙමින්...",
              ]
            : [React.createElement(Mic, { key: "mic" }), " පටිගත කිරීම අරඹන්න"]
        ),

        transcript &&
          React.createElement(
            "div",
            {
              className:
                "mt-3 bg-green-50 border border-green-200 p-3 rounded-lg text-green-700 text-sm",
            },
            React.createElement("strong", null, "🗣️ ඔබේ පිළිතුර: "),
            transcript
          )
      )
  );
}

export default QuestionCard;
