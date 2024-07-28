export const SelectedTopics = (selectedTopics:{title:string}[]) => {
  console.log("selected topic",selectedTopics)
    const maxTopicsToShow = 2; // Maximum number of topics to display without tooltip

    if (selectedTopics.length <= maxTopicsToShow) {
      // If there are 2 or fewer topics, display all of them
      return (
        <div className="flex">
          {selectedTopics.map((item, index) => (
            <p key={index+item.title}>{item.title}, </p>
          ))}
        </div>
      );
    } else {
      // If there are more than 2 topics, display the first two followed by "..."
      const displayedTopics = selectedTopics.slice(0, maxTopicsToShow);
      return (
        <div className="flex">
          {displayedTopics.map((item, index) => (
            <p key={index}>{item.title}, </p>
          ))}
          <p key="more">...</p>
        </div>
      );
    }
  };