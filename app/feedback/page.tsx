"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star } from "lucide-react";
import { getCurrentUser, type MockUser } from "@/lib/mock-users";
import { toast } from "sonner";

export default function FeedbackPage() {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  if (!mounted || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    toast.success("Feedback submitted successfully!");
    setRating(0);
    setComment("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Course Feedback</h2>
        <p className="text-muted-foreground">
          Share your thoughts and help improve courses
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#261CC1]" />
              Submit Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course</label>
              <select className="w-full p-2 border rounded-md">
                <option>CSC101 - Introduction to Computer Science</option>
                <option>CSC201 - Data Structures and Algorithms</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                placeholder="Share your feedback about this course..."
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <label htmlFor="anonymous" className="text-sm">
                Submit anonymously
              </label>
            </div>

            <Button
              className="w-full bg-[#261CC1] hover:bg-[#1e1499]"
              onClick={handleSubmit}
            >
              Submit Feedback
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  course: "CSC101",
                  rating: 5,
                  comment: "Excellent course! Very well structured.",
                  anonymous: true,
                  date: "2024-02-15",
                },
                {
                  course: "CSC201",
                  rating: 4,
                  comment: "Good content but could use more examples.",
                  anonymous: false,
                  author: "Chidi Okafor",
                  date: "2024-02-14",
                },
              ].map((feedback, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{feedback.course}</Badge>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= feedback.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{feedback.comment}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {feedback.anonymous
                        ? "Anonymous"
                        : feedback.author || "Unknown"}
                    </span>
                    <span>{feedback.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
