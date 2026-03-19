"""
AgriShield AI - Mock Backend API
Production-ready Flask server for frontend integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

# ============================================================================
# CHATBOT SERVICE
# ============================================================================

CHATBOT_RESPONSES = {
    'hi': [
        'Namaste! Main AgriShield AI hoon. Aapki kaise madad kar sakta hoon?',
        'Hello! Kya aap apni fasal ke baare mein jaanna chahte hain?'
    ],
    'crop': [
        'Aapke area mein {rainfall}mm rainfall hai. {crop} best option hai.',
        'Current weather conditions ke hisaab se, {crop} grow karna safe rahega.'
    ],
    'weather': [
        'Abhi temperature {temp}°C hai aur humidity {humidity}% hai.',
        'Aaj ka weather {condition} hai. Fasal ke liye {advice}.'
    ],
    'risk': [
        'Aapka current risk score {risk}% hai. {advice}',
        'Risk level {level} hai. Main recommend karta hoon: {recommendation}'
    ],
    'default': [
        'Main aapki query samajh gaya. Kya aap specific details de sakte hain?',
        'Aur batayein, kya jaanna chahte hain?'
    ]
}

def get_chatbot_response(message, context):
    """Generate context-aware chatbot response"""
    message_lower = message.lower()
    
    # Extract context
    risk_score = context.get('riskScore', 45)
    rainfall = context.get('rainfall', 25)
    temp = context.get('temperature', 28)
    humidity = context.get('humidity', 65)
    condition = context.get('condition', 'Clear')
    top_crop = context.get('topCrop', 'Bajra')
    
    # Determine response category
    if any(word in message_lower for word in ['hi', 'hello', 'namaste', 'hey']):
        responses = CHATBOT_RESPONSES['hi']
    elif any(word in message_lower for word in ['crop', 'fasal', 'grow', 'kya', 'ugau']):
        responses = CHATBOT_RESPONSES['crop']
        return random.choice(responses).format(rainfall=rainfall, crop=top_crop)
    elif any(word in message_lower for word in ['weather', 'mausam', 'rain', 'barish']):
        responses = CHATBOT_RESPONSES['weather']
        advice = 'achha hai' if rainfall > 20 else 'irrigation ki zarurat hai'
        return random.choice(responses).format(
            temp=temp, humidity=humidity, condition=condition, advice=advice
        )
    elif any(word in message_lower for word in ['risk', 'khatre', 'danger', 'safe']):
        responses = CHATBOT_RESPONSES['risk']
        level = 'Low' if risk_score < 30 else 'Medium' if risk_score < 60 else 'High'
        advice = 'Aap safe hain' if risk_score < 40 else 'Thoda careful rahein'
        recommendation = f'{top_crop} grow karein' if risk_score < 50 else 'Drought-resistant crops choose karein'
        return random.choice(responses).format(
            risk=risk_score, level=level, advice=advice, recommendation=recommendation
        )
    else:
        responses = CHATBOT_RESPONSES['default']
    
    return random.choice(responses)

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chatbot endpoint"""
    try:
        data = request.json
        message = data.get('message', '')
        context = data.get('context', {})
        
        response = get_chatbot_response(message, context)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat(),
            'suggestions': [
                'Kaunsi fasal best hai?',
                'Risk score kya hai?',
                'Weather kaisa hai?'
            ]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# RISK ANALYSIS SERVICE
# ============================================================================

def calculate_risk_score(rainfall, temperature, soil_type, season):
    """Calculate risk score based on inputs"""
    base_risk = 50
    
    # Rainfall impact
    if rainfall < 10:
        base_risk += 20
    elif rainfall < 20:
        base_risk += 10
    elif rainfall > 50:
        base_risk += 15
    else:
        base_risk -= 10
    
    # Temperature impact
    if temperature > 35:
        base_risk += 15
    elif temperature < 15:
        base_risk += 10
    else:
        base_risk -= 5
    
    # Soil type impact
    soil_risk = {
        'Sandy': 10,
        'Clay': 5,
        'Loamy': -10,
        'Black': -5,
        'Red': 0
    }
    base_risk += soil_risk.get(soil_type, 0)
    
    # Season impact
    season_risk = {
        'Kharif': -5,
        'Rabi': 0,
        'Zaid': 10
    }
    base_risk += season_risk.get(season, 0)
    
    return max(0, min(100, base_risk))

@app.route('/api/risk-analysis', methods=['POST'])
def risk_analysis():
    """Risk analysis endpoint"""
    try:
        data = request.json
        
        rainfall = data.get('rainfall', 25)
        temperature = data.get('temperature', 28)
        soil_type = data.get('soilType', 'Loamy')
        season = data.get('season', 'Kharif')
        
        risk_score = calculate_risk_score(rainfall, temperature, soil_type, season)
        
        # Generate factors
        factors = []
        if rainfall < 20:
            factors.append({
                'name': 'Low Rainfall',
                'impact': 'High',
                'description': 'Insufficient rainfall may affect crop growth'
            })
        if temperature > 35:
            factors.append({
                'name': 'High Temperature',
                'impact': 'Medium',
                'description': 'Heat stress may reduce yield'
            })
        if soil_type == 'Sandy':
            factors.append({
                'name': 'Sandy Soil',
                'impact': 'Medium',
                'description': 'Poor water retention capacity'
            })
        
        # Generate recommendations
        recommendations = []
        if risk_score > 60:
            recommendations.append('Consider drought-resistant crops')
            recommendations.append('Implement drip irrigation')
        elif risk_score > 40:
            recommendations.append('Monitor weather closely')
            recommendations.append('Ensure adequate irrigation')
        else:
            recommendations.append('Conditions are favorable')
            recommendations.append('Proceed with planned crops')
        
        return jsonify({
            'riskScore': risk_score,
            'factors': factors,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# CROP RECOMMENDATION SERVICE
# ============================================================================

CROP_DATABASE = {
    'Bajra': {'minRain': 15, 'maxRain': 40, 'minTemp': 25, 'maxTemp': 35, 'soils': ['Sandy', 'Loamy']},
    'Jowar': {'minRain': 20, 'maxRain': 50, 'minTemp': 20, 'maxTemp': 35, 'soils': ['Black', 'Loamy']},
    'Wheat': {'minRain': 30, 'maxRain': 60, 'minTemp': 15, 'maxTemp': 25, 'soils': ['Loamy', 'Clay']},
    'Rice': {'minRain': 50, 'maxRain': 100, 'minTemp': 20, 'maxTemp': 35, 'soils': ['Clay', 'Loamy']},
    'Cotton': {'minRain': 25, 'maxRain': 60, 'minTemp': 20, 'maxTemp': 35, 'soils': ['Black', 'Red']},
    'Sugarcane': {'minRain': 60, 'maxRain': 120, 'minTemp': 20, 'maxTemp': 35, 'soils': ['Loamy', 'Clay']},
    'Maize': {'minRain': 30, 'maxRain': 70, 'minTemp': 18, 'maxTemp': 32, 'soils': ['Loamy', 'Sandy']},
    'Groundnut': {'minRain': 20, 'maxRain': 50, 'minTemp': 20, 'maxTemp': 30, 'soils': ['Sandy', 'Loamy']}
}

def score_crop(crop_name, crop_data, rainfall, temperature, soil_type):
    """Score a crop based on suitability"""
    score = 100
    
    # Rainfall suitability
    if rainfall < crop_data['minRain']:
        score -= (crop_data['minRain'] - rainfall) * 2
    elif rainfall > crop_data['maxRain']:
        score -= (rainfall - crop_data['maxRain']) * 1.5
    
    # Temperature suitability
    if temperature < crop_data['minTemp']:
        score -= (crop_data['minTemp'] - temperature) * 3
    elif temperature > crop_data['maxTemp']:
        score -= (temperature - crop_data['maxTemp']) * 3
    
    # Soil suitability
    if soil_type not in crop_data['soils']:
        score -= 20
    
    return max(0, min(100, score))

@app.route('/api/crop-recommendations', methods=['POST'])
def crop_recommendations():
    """Crop recommendation endpoint"""
    try:
        data = request.json
        
        rainfall = data.get('rainfall', 25)
        temperature = data.get('temperature', 28)
        soil_type = data.get('soilType', 'Loamy')
        
        # Score all crops
        crop_scores = []
        for crop_name, crop_data in CROP_DATABASE.items():
            score = score_crop(crop_name, crop_data, rainfall, temperature, soil_type)
            
            # Generate reason
            if score > 80:
                reason = 'Excellent match for current conditions'
            elif score > 60:
                reason = 'Good option with proper care'
            elif score > 40:
                reason = 'Moderate suitability'
            else:
                reason = 'Not recommended for current conditions'
            
            crop_scores.append({
                'name': crop_name,
                'score': round(score, 1),
                'reason': reason,
                'suitability': 'High' if score > 70 else 'Medium' if score > 50 else 'Low'
            })
        
        # Sort by score
        crop_scores.sort(key=lambda x: x['score'], reverse=True)
        
        return jsonify({
            'crops': crop_scores,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# WHAT-IF SCENARIO SERVICE
# ============================================================================

@app.route('/api/what-if', methods=['POST'])
def what_if_scenario():
    """What-if scenario analysis endpoint"""
    try:
        data = request.json
        
        current = data.get('current', {})
        changes = data.get('changes', {})
        
        # Merge current with changes
        scenario = {**current, **changes}
        
        # Calculate new risk score
        new_risk = calculate_risk_score(
            scenario.get('rainfall', 25),
            scenario.get('temperature', 28),
            scenario.get('soilType', 'Loamy'),
            scenario.get('season', 'Kharif')
        )
        
        old_risk = current.get('riskScore', 50)
        risk_change = new_risk - old_risk
        
        # Generate impact analysis
        impact = {
            'riskChange': risk_change,
            'direction': 'increased' if risk_change > 0 else 'decreased' if risk_change < 0 else 'unchanged',
            'magnitude': abs(risk_change),
            'factors': []
        }
        
        # Analyze specific changes
        if 'rainfall' in changes:
            rain_diff = changes['rainfall'] - current.get('rainfall', 25)
            impact['factors'].append({
                'factor': 'Rainfall',
                'change': f'{rain_diff:+.1f}mm',
                'effect': 'Positive' if rain_diff > 0 and rain_diff < 30 else 'Negative'
            })
        
        if 'temperature' in changes:
            temp_diff = changes['temperature'] - current.get('temperature', 28)
            impact['factors'].append({
                'factor': 'Temperature',
                'change': f'{temp_diff:+.1f}°C',
                'effect': 'Negative' if abs(temp_diff) > 5 else 'Neutral'
            })
        
        # Generate recommendations
        recommendations = []
        if new_risk > old_risk:
            recommendations.append('Risk has increased - consider mitigation strategies')
            recommendations.append('Review crop selection based on new conditions')
        elif new_risk < old_risk:
            recommendations.append('Conditions have improved')
            recommendations.append('Good time to proceed with planned activities')
        else:
            recommendations.append('No significant change in risk level')
        
        return jsonify({
            'newRiskScore': new_risk,
            'oldRiskScore': old_risk,
            'impact': impact,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================================================
# UTILITY ENDPOINTS
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AgriShield AI Backend',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/soil-types', methods=['GET'])
def soil_types():
    """Get available soil types"""
    return jsonify({
        'soilTypes': ['Sandy', 'Clay', 'Loamy', 'Black', 'Red'],
        'timestamp': datetime.now().isoformat()
    })

# ============================================================================
# SERVER STARTUP
# ============================================================================

if __name__ == '__main__':
    print('🌾 AgriShield AI Backend Starting...')
    print('📡 API Base URL: http://localhost:5000/api')
    print('🔗 CORS Enabled for Frontend Connection')
    print('✅ Ready to serve requests')
    app.run(debug=True, host='0.0.0.0', port=5000)
