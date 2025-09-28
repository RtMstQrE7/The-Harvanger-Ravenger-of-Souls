from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Game(db.Model):
    __tablename__ = 'games'
    
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.String(50), unique=True, nullable=False)
    player1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    player2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    status = db.Column(db.String(20), default='waiting')  # waiting, active, completed, abandoned
    winner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    game_state = db.Column(db.Text, nullable=True)  # JSON string of game state
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    player1 = db.relationship('User', foreign_keys=[player1_id], backref='games_as_player1')
    player2 = db.relationship('User', foreign_keys=[player2_id], backref='games_as_player2')
    winner = db.relationship('User', foreign_keys=[winner_id], backref='games_won')
    
    def to_dict(self):
        return {
            'id': self.id,
            'game_id': self.game_id,
            'player1_id': self.player1_id,
            'player2_id': self.player2_id,
            'player1_username': self.player1.username if self.player1 else None,
            'player2_username': self.player2.username if self.player2 else None,
            'status': self.status,
            'winner_id': self.winner_id,
            'winner_username': self.winner.username if self.winner else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def get_game_state(self):
        if self.game_state:
            return json.loads(self.game_state)
        return None
    
    def set_game_state(self, state):
        self.game_state = json.dumps(state)
        self.updated_at = datetime.utcnow()

class GameMove(db.Model):
    __tablename__ = 'game_moves'
    
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.String(50), db.ForeignKey('games.game_id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    move_type = db.Column(db.String(50), nullable=False)  # play_card, attack, pass_turn, etc.
    move_data = db.Column(db.Text, nullable=True)  # JSON string of move details
    turn_number = db.Column(db.Integer, nullable=False)
    phase = db.Column(db.String(20), nullable=False)  # untap, upkeep, draw, main1, combat, main2, end
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    game = db.relationship('Game', backref='moves')
    player = db.relationship('User', backref='moves')
    
    def to_dict(self):
        return {
            'id': self.id,
            'game_id': self.game_id,
            'player_id': self.player_id,
            'player_username': self.player.username,
            'move_type': self.move_type,
            'move_data': json.loads(self.move_data) if self.move_data else None,
            'turn_number': self.turn_number,
            'phase': self.phase,
            'timestamp': self.timestamp.isoformat()
        }

class ClanMembership(db.Model):
    __tablename__ = 'clan_memberships'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    clan_name = db.Column(db.String(50), nullable=False, default='R&R Clan')
    role = db.Column(db.String(20), default='member')  # member, admin, leader
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='active')  # active, inactive, banned
    
    # Relationships
    user = db.relationship('User', backref='clan_membership')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.user.username,
            'clan_name': self.clan_name,
            'role': self.role,
            'joined_at': self.joined_at.isoformat(),
            'status': self.status
        }

