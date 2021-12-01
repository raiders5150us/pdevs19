namespace ProjectDevs.Core.Models
{
    public struct StoryHour
    {
        public float ProjectedHours { get; }
        public float ActualHours { get; }
        public StoryHour(float? projected = 0, float? actual = 0)
        {
            ProjectedHours = projected ?? 0;
            ActualHours = actual ?? 0;
        }
    }
}
