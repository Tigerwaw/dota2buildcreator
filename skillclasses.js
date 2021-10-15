class Skill
{
	constructor(maxLevel)
	{
		this.level = 0;
		this.maxLevel = 4;
		this.assignedPoints = [];
		this.earliestPoint = [1, 3, 5, 7];
	}
	
	levelUp(charLevel)
	{
		if (this.level == this.maxLevel) { return false; }
		if (charLevel < this.earliestPoint[this.level]) { return false; }
		
		this.assignedPoints.push(charLevel);
		this.level += 1;
		
		return true;
	}
	
	levelDown(charLevel)
	{
		if (this.level == 0) { return false; }
		// Checks if the latest skillpoint in this level was skilled at the previous level.
		if (this.assignedPoints[this.level - 1] != charLevel - 1) { return false; }
		
		this.assignedPoints.pop();
		this.level -= 1;
		return true;
	}
}

class UltSkill extends Skill
{
	constructor()
	{
		super();
		this.maxLevel = 3;
		this.earliestPoint = [6, 12, 18];
	}
}

class TalentSkill extends Skill
{
	constructor()
	{
		super();
		this.maxLevel = 4;
		this.earliestPoint = [10, 15, 20, 25];
	}
}

class StatSkill extends Skill
{
	constructor()
	{
		super();
		this.maxLevel = 6;
		this.earliestPoint = [0, 0, 0, 0, 0, 0, 0];
	}
}